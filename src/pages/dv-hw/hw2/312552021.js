const {
  csv,
  select,
} = d3;

import { parallelPlot } from './312552021_1.js';

const csvUrl = 'https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/iris.csv'
const parseRow = (d) => {
  if (d.class == null || d.class == "") return null;
  d['sepal length'] = +d['sepal length'];
  d['sepal width'] = +d['sepal width'];
  d['petal length'] = +d['petal length'];
  d['petal width'] = +d['petal width'];
  return d;
};


const svg1 = select('.svg1');
const svg2 = select('.svg2');
const width = +svg1.attr('width');
const height = +svg1.attr('height');
const margin = { top: 90, right: 180, bottom: 90, left: 60 };
// const menuContainer = select('body')
//   .append('div')
//   .attr('class', 'menu-container')
//   .append('h1')
//   .attr('class', 'name')
//   .text('Parallel Graph of Iris Dataset');

// const footer = select('body')
//   .append('footer')
//   .text("Source:")
//   .append('a')
//   .attr("href", csvUrl)
//   .style("margin-left", "10px")
//   .html(csvUrl);





const main = async () => {
  const data = await csv(csvUrl, parseRow);

  const plot1 = parallelPlot()
    .data(data)
    .title('Parallel Graph of Iris Dataset: Constant Y')  
    .width(width)
    .height(height)
    .margin(margin)
    .constantY(true);
  
  const plot2 = parallelPlot()
    .data(data)
    .title('Parallel Graph of Iris Dataset: MinMax Y')  
    .width(width)
    .height(height)
    .margin(margin)
    .constantY(false);

  svg1.call(plot1);
  svg2.call(plot2);
};

main();
