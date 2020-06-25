

const d3 = require("d3");
const topojson = require("topojson-client");

import { Dataworker, Filetype } from 'dataworker';
import { memory } from "dataworker/dataworker_bg";


const asyncWait = async (count) => new Promise(resolve => setTimeout(resolve, count? count : 1000 ));

// const chartWidth = 5000;
// const chartHeight = 5000;
//
// const svg = d3.select("body").append("svg")
//     .attr("height", chartHeight)
//     .attr("width", chartWidth)
//     .attr("viewBox", `0 -20 ${chartWidth} ${chartHeight}`);
//
// const circleRadius = 3;
// const circleDiameter = circleRadius * 2;
//
// const polarY = (radius, theta) => radius * Math.sin(theta) / 3;
// const polarX = (radius, theta) => radius * Math.cos(theta) / 3;
//
// const draw = () => {
//   const t = svg.transition()
//       .duration(750);
//
//   svg.selectAll("circle")
//     .data(matrix, d => d)
//     .join(
//       enter => enter
//           .append("circle")
//           .attr("fill", "green")
//           .attr('cx', (d, i) => (chartWidth / 2) + polarX(i, i))
//           .attr('cy', (d, i) => (chartHeight / 2) + polarY(i, i))
//           .attr('r', circleRadius)
//           .text(d => d)
//         .call(enter => enter.transition(t)
//           .attr("y", 0)),
//       update => update
//           .attr("fill", "black")
//           .attr("y", 0),
//       exit => exit
//           .attr("fill", "brown")
//         .call(exit => exit.transition(t)
//           .attr("y", 30)
//           .remove())
//     );
// }
//
// (async () => {
//   while (true) {
//     dataworker.reset();
//     draw();
//     await asyncWait(100);
//   }
// })();


const mapUrl = "https://raw.githubusercontent.com/nychealth/coronavirus-data/master/Geography-resources/MODZCTA_2010_WGS1984.geo.json";
const dataUrl = "https://api.github.com/repos/nychealth/coronavirus-data/commits?path=data-by-modzcta.csv"

// https://api.github.com/repos/nychealth/coronavirus-data/commits?path=data-by-modzcta.csv
// https://raw.githubusercontent.com/nychealth/coronavirus-data/cf508e8fe08ddff44a847c1b54209c598b88c913/data-by-modzcta.csv

const chartWidth = 960,
      chartHeight = 1160;

let data;

(async () => {

  const nyc = await d3.json(mapUrl);
  console.log(nyc);
  const chunk = await Dataworker.getData(dataUrl, Filetype.JSON);
  const width = chunk.width();
  const height = chunk.height();
  const dataPtr = chunk.data();
  const matrix = new Uint32Array(memory.buffer, dataPtr, width * height);
  console.log(chunk, );

  var svg = d3.select("body").append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

  var path = d3.geoPath()
      .projection(d3.geoConicConformal()
      .parallels([33, 45])
      .rotate([96, -39])
      .fitSize([chartWidth, chartHeight], nyc));

  svg.selectAll("path")
      .data(nyc.features)
      .enter().append("path")
      .attr("d", path)
      .attr("class", (d) => d.properties.MODZCTA)
      .attr("d", path);

})();