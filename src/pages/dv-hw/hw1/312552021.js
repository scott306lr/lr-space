const {
  csv,
  select,
} = d3;

import { scatterPlot } from './312552021_1.js';
import { menu } from './312552021_2.js';

const width = window.innerWidth;
const height = window.innerHeight;

const csvUrl = 'https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/iris.csv'
const parseRow = (d) => {
  if (d.class == null || d.class == "") return null
  d['sepal length'] = +d['sepal length'];
  d['sepal width'] = +d['sepal width'];
  d['petal length'] = +d['petal length'];
  d['petal width'] = +d['petal width'];
  return d;
};

const options = [
  { value: 'sepal length', label: 'Sepal Length' },
  { value: 'sepal width', label: 'Sepal Width' },
  { value: 'petal length', label: 'Petal Length' },
  { value: 'petal width', label: 'Petal Width' },
]
const yDefault = options[0].value;
const xDefault = options[2].value;

const margin = {
  top: 150,
  right: 200,
  bottom: 100,
  left: 200,
}

const menuContainer = select('body')
  .append('div')
  .attr('class', 'menu-container')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const svgContainer = select('body')
  .append('div')
  .attr('class', 'svg-container');

const yMenu = menuContainer.append('div');
const name = menuContainer.append('h1').attr('class', 'name')
  .text('Parallel Graph of Iris Dataset');
const xMenu = menuContainer.append('div');

const svg = svgContainer
  .append('svg')
  // .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .classed("svg-content", true)

const bottom = select('body')
  .append('footer')
  .text("Source:")
  .append('a')
  .attr("href", csvUrl)
  .style("margin-left", "10px")
  .html(csvUrl);

const disableRedundantMenuValue = () => {
  const x_val = xMenu.select('select').property('value');
  const y_val = yMenu.select('select').property('value');

  //set option in yMenu with xMenu value to disabled
  yMenu.select('select').selectAll('option').each(function(d) {
    if (d.value == x_val) {
      d3.select(this).attr('disabled', true);
    } else {
      d3.select(this).attr('disabled', null);
    }
  });
  //set option in xMenu with yMenu value to disabled
  xMenu.select('select').selectAll('option').each(function(d) {
    if (d.value == y_val) {
      d3.select(this).attr('disabled', true);
    } else {
      d3.select(this).attr('disabled', null);
    }
  });
}


const main = async () => {
  const data = await csv(csvUrl, parseRow);
  const plot = scatterPlot()
    .width(width)
    .height(height)
    .data(data)
    .yScope(yDefault)
    .xScope(xDefault)
    .margin(margin)
    .radius(8)
  svg.call(plot);

  // select('menuContainer').attr('transform', `translate(${margin.left}, ${margin.top})`);
  yMenu.call(
    menu()
    .id("y-menu")
    .labelText("Y-Axis: ")
    .options(options)
    .selected(yDefault)
    .on('change', (value) => {
      plot.yScope(value);
      svg.call(plot);

      disableRedundantMenuValue();
    })
  );

  xMenu.call(
    menu()
    .id("x-menu")
    .labelText("X-Axis: ")
    .options(options)
    .selected(xDefault)
    .on('change', (value) => {
      plot.xScope(value);
      svg.call(plot);

      disableRedundantMenuValue();
    })
  );
  disableRedundantMenuValue();
};

main();
