const {
  select, 
  scaleLinear,
  scalePoint,
  axisLeft,
  line,
  drag,
} = d3;
import { get_unique, get_colorMap } from "./312552021_2.js";
import { sideContent } from "./312552021_3.js";

export const parallelPlot = () => {
  let data;
  let title;
  let width;
  let height;
  let margin;
  let constantY = true;
  let firstRender = true;
  
  let classes;
  let colorMapping;
  let yMapping = new Map();

  const get_class = (d) => d.class;
  const transition = g =>  
    g.transition().duration(350)
  
  const axisLogoMapper = {
    "sepal length": "sepal length \uf06c \uf07d",
    "sepal width": "sepal width \uf06c \uf07e",
    "petal length": "petal length \ue139 \uf07d",
    "petal width": "petal width \ue139 \uf07e",
  }
  
  const my = (selection) => {
    const g = selection.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.right - margin.left;
    
    colorMapping = get_colorMap(get_unique(data, 'class'));
    classes = data.columns.filter((d) => d !== 'class');
    classes.forEach((className) => {
      const dataMin = Math.min(...data.map(d => d[className]-0.1));
      const dataMax = Math.max(...data.map(d => d[className]+0.1));
      yMapping.set(className, scaleLinear()
        .domain([dataMin, dataMax])
        .range([innerHeight, 0]));
    });

    selection.call(sideContent, colorMapping);

    const render = () => {
      const x = scalePoint()
      .domain(classes)
      .range([0, innerWidth]);
  
      const y = (className) => {
        if (!constantY) {
          return yMapping.get(className);
        }else {
          return scaleLinear()
          .domain([0, 8])
          .range([innerHeight, 0]);
        }
      };

      const position = new Map();

      const correctXPos = d =>{
        return position.has(d) ? position.get(d) : x(d);
      };

      const generateLine = (d) =>
        line()(classes.map(p => [x(p), y(p)(d[p])] ));
      
      const generateLineMoving = (d) =>
        line()(classes.map(p => [correctXPos(p), y(p)(d[p])] ));

      //資料
      const pathG = g.selectAll('path').data(data)
      .join(
        enter => enter.append('path')
          .attr('d', d => generateLine(d))
          .attr('stroke',  d => colorMapping.get(get_class(d)))
          .attr('fill', 'none')
          .attr('opacity', 0.35)
          .attr('stroke-width', 2),
        update => update
          .transition().duration(350)
          .attr('d', d => generateLine(d))
          .attr('stroke',  d => colorMapping.get(get_class(d)))
          .attr('fill', 'none')
          .attr('opacity', 0.35)
          .attr('stroke-width', 2),
        exit => exit.remove()
      )
      
      //軸 transition float
      const axisY = (className) => 
        axisLeft().scale(y(className))
        .tickPadding(5)
        .tickSize(5)
        .tickFormat(d => d.toFixed(1))
        // .tickSizeOuter(0)
        
      const axisG = g.selectAll('.axes').data(classes)
      .join(
        enter => enter.append('g')
          .attr('class', 'axes')
          .each(function(className) { console.log(className);select(this).call(axisY(className))})
          .attr('transform', d => 'translate(' + x(d) +',0)'),
        
        // with transition
        update => update
          .transition().duration(350)
          .each(function(className) { select(this).transition().duration(350).call(axisY(className))})
          .attr('transform', d => 'translate(' + correctXPos(d) +',0)'),
          
        exit => exit.remove()
      )


      const dragging = (d, xDragPosition) => {
        position.set(d, Math.min(innerWidth+30, Math.max(-30, xDragPosition)));
        classes.sort( (p,q) => correctXPos(p) - correctXPos(q));
        x.domain(classes);
        
        pathG.attr('d', d => generateLineMoving(d));
        axisG.attr('transform', d => 'translate(' + correctXPos(d) +',0)');
      } 

      const dragended = d => {
        position.delete(d);
        transition(pathG).attr("d",  d => generateLine(d));
        transition(axisG).attr("transform", p => "translate(" + x(p) + ",0)"); 
      }

      //drag
      axisG.call(drag()
        .subject(function(d) { return {x: x(d)}; })
        .on('start', (event, d) => position.set(d, x(d)))
        .on('drag', (event, d) => dragging(d, event.x))
        .on('end', (event, d) => dragended(d))
        );

      //checkbox, rerender when click, button style, toggle y constant
      // g.selectAll('.button').data([constantY])
      // .join('text')
      //   .attr('class', 'button')
      //   .attr('x', innerWidth/2)
      //   .attr('y', '-30px')
        
      //   .on('click', () => {
      //     constantY = !constantY;
      //     render();
      //   })
      //   .text(d => d ? '\uf204 Y-Axis: Constant' : '\uf205 Y-Axis: Min-max')


      if (firstRender) {
        axisG
          .on('mouseover', d => select(this).style("cursor", "wait"))
          .on('mouseout' , d => select(this).style("cursor", "default"));

        //axis name
        axisG.append('text')
          .attr('fill','black')
          .attr('font-family', 'sans-serif, FontAwesome')
          .attr('transform', `translate(0,${innerHeight})`)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', 18)
          .text(d =>  axisLogoMapper[d]);
        
        //drag icon
        axisG.append('text')
          .attr("y", '-15px')
          .attr('font-family', 'FontAwesome')
          .attr('font-size', '32px')
          .style("fill", "black")
          .style("text-anchor", "middle")
          .text('\uf7a4')
    
        //title
        g.append('text')
          .attr('class', 'title')
          .attr('x', innerWidth/2)
          .attr('y', '-60px')
          .style('text-anchor', 'middle')
          .text(title)

        firstRender = false;
      }

    };

    render();
  };

  my.data = function (_) {
    return arguments.length
      ? ((data = _), my)
      : data;
  };

  my.title = function (_) {
    return arguments.length
      ? ((title = _), my)
      : title;
  };

  my.width = function (_) {
    return arguments.length
      ? ((width = +_), my)
      : width;
  };

  my.height = function (_) {
    return arguments.length
      ? ((height = +_), my)
      : height;
  };

  my.margin = function (_) {
    return arguments.length
      ? ((margin = _), my)
      : margin;
  };

  my.constantY = function (_) {
    return arguments.length
      ? ((constantY = _), my)
      : constantY;
  }

  return my;
};
