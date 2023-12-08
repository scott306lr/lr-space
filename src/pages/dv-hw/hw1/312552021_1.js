const {
  scaleLinear,
  min,
  max,
  axisLeft,
  axisBottom,
  transition,
} = d3;

export const scatterPlot = () => {
  const myColors = [
    'red',
    'green',
    'blue',
    'orange',
    'brown',
  ];

  let width;
  let height;
  let data;
  let xScope;
  let yScope;
  let margin;
  let radius;

  const margin_label = 200;

  const xValue = (d) => d[xScope];
  const yValue = (d) => d[yScope];
  
  const my = (selection) => {
    const x = scaleLinear()
      .domain([
        Math.floor(min(data, xValue)*2 - 0.1) / 2,
        Math.ceil(max(data, xValue)*2 + 0.1) / 2,
      ])
      .range([margin.left, width - (margin.right+margin_label)]);

    const y = scaleLinear()
      .domain([
        Math.floor(min(data, yValue)*2 - 0.1) / 2,
        Math.ceil(max(data, yValue)*2 + 0.1) / 2,
      ])
      .range([
        height - margin.bottom,
        margin.top,
      ]);

    let colorMapping = new Map();
    const marks = data.map((d) => {
      let color = colorMapping.get(d.class);
      if (color == null) {
        color = myColors[colorMapping.size];
        colorMapping.set(d.class, color);
      }
      return {
        x: x(xValue(d)),
        y: y(yValue(d)),
        color: color,
        text: `Class: ${d.class}\ny: ${yScope}=${yValue(d)}\nx: ${xScope}=${xValue(d)}\n`,
      };
    });

    const t = transition()
      .duration(1000)

    const t_sm = transition()
      .duration(300)
    
    const jitter = (n) => {
      return Math.random() * n - n/2;
    }
    const setCirclesStats = (circles) => {
      circles
        .attr('cx', (d) => d.x)// + jitter(5))
        .attr('cy', (d) => d.y)// + jitter(5))
        .attr('r', radius)
        .attr('fill', (d) => d.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
    };

    const growIn = (circles) => {
      circles
        .attr('r', 0)
        .transition(t)
        .attr('r', radius);
    };

    const circles = selection
      .selectAll('circle')
      .data(marks)
      .join(
        enter => enter
          .append('circle')
          .call(setCirclesStats)
          .call(growIn)
          .append('title')
          .text((d) => d.text),
        update => update
          .call(update => update
            .transition(t).delay((d, i) => i*2)
            .call(setCirclesStats)
          )
          .select('title')
          .text((d) => d.text),
        exit => exit.remove())

    selection
      .selectAll('g.y-axis')
      .data([null])
      .join('g')
      .attr('class', 'y-axis')
      .attr(
        'transform',
        `translate(${margin.left}, 0)`
      )
      .transition(t)
      .call(axisLeft(y));

    selection
      .selectAll('g.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr(
        'transform',
        `translate(0, ${height - margin.bottom})`
      )
      .transition(t)
      .call(axisBottom(x));
    
    selection
      .selectAll('g.y-label')
      .data([null])
      .join(
        enter => enter
          .append('g')
          .attr('class', 'y-label')
          .attr('transform', `translate(${margin.left+30}, ${height/2})`)
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('transform', 'rotate(-90)')
          .text(yScope + ' →')
          .attr('opacity', 0)
          .attr('x', 0)
          .transition(t)
          .attr('opacity', 0.5)
          .attr('x', height/2 - margin.top - 100),
          
        update => update
          .select('text')
          .transition(t_sm)
          .attr('opacity', 0)
          .attr('x', height/2)
          .transition(t_sm)
          .attr('opacity', 0)
          .attr('x', 0)
          .transition(t)
          .text(yScope + ' →')
          .attr('opacity', 0.5)
          .attr('x', height/2 - margin.top - 100),
        exit => exit.remove(),
      );

      selection
      .selectAll('g.x-label')
      .data([null])
      .join(
        enter => enter
          .append('g')
          .attr('class', 'x-label')
          .attr('transform', `translate(${width/2}, ${height - margin.bottom - 30})`)
          .append('text')
          .attr('text-anchor', 'middle')
          .text(xScope + ' →')
          .attr('opacity', 0)
          .attr('x', 0)
          .transition(t)
          .attr('opacity', 0.5)
          .attr('x', width/2 - (margin.right+margin_label) - 100),
          
        update => update
          .select('text')
          .transition(t_sm)
          .attr('opacity', 0)
          .attr('x', width/2)
          .transition(t_sm)
          .attr('opacity', 0)
          .attr('x', 0)
          .transition(t)
          .text(xScope + ' →')
          .attr('opacity', 0.5)
          .attr('x', width/2 - (margin.right+margin_label) - 100),
        exit => exit.remove(),
      );

      
      const rect = selection.select(".myLegendBox").node() ?
      selection.selectAll(".myLegend") :
      selection
      .selectAll(".myLegend")
      .data([null])
      .join('g')
      .attr('class', 'myLegendBox')
      .append('rect')
      .attr('transform', `translate(${width - margin.right - 160}, ${margin.top - 30})`)
      .attr('width', 200)
      .attr('height', colorMapping.size * 30 + 15)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('opacity', 0.5)

      selection
      .selectAll(".myLegend")
      .data(colorMapping)
      .join('g')
      .attr('class', 'myLegend')
      .attr('transform', (d, i) => `translate(${width - margin.right - 150}, ${margin.top + (i) * 30})`)
      .append('text')
      .attr('font-size', '24px')
      .text(d => d[0])
      .style('fill', d => d[1])
      .style('font-weight', 'bold')
      .style('font-family', 'Arial')
      .append('title')
      .text(d => d[0])
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
  
  my.data = function (_) {
    return arguments.length
      ? ((data = _), my)
      : data;
  };
  
  my.xScope = function (_) {
    return arguments.length
      ? ((xScope = _), my)
      : xScope;
  };
  
  my.yScope = function (_) {
    return arguments.length
      ? ((yScope = _), my)
      : yScope;
  };
  
  my.margin = function (_) {
    return arguments.length
      ? ((margin = _), my)
      : margin;
  };
  
  my.radius = function (_) {
    return arguments.length
      ? ((radius = +_), my)
      : radius;
  };
  
  return my;
};

