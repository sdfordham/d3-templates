var d3 = require("d3");
var d3Scatterplot = {};

d3Scatterplot.create = (el, data, configuration) => {
  d3Scatterplot.update(el, data, configuration)
};

d3Scatterplot.update = (el, data, configuration) => {
  const margin = ({top: 25, right: 20, bottom: 35, left: 40})

  d3.select(el)
    .append("svg")
    .attr("viewBox", [0, 0, configuration.width, configuration.height]);

  var svg = d3.select(el).select("svg")

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.datetime))).nice()
    .range([margin.left, configuration.width - margin.right])

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.ibin)).nice()
    .range([configuration.height - margin.bottom, margin.top])

  const color = d3.scaleOrdinal(data.map(d => d.lot), d3.schemeCategory10)
  const shape = d3.scaleOrdinal(data.map(d => d.lot), d3.symbols.map(s => d3.symbol().type(s)()))

  const xAxis = g => g
    .attr("transform", `translate(0,${configuration.height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(configuration.width / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", configuration.width)
      .attr("y", margin.bottom - 4)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text(data.datetime))
  
  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(data.ibin))

  const grid = g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
      .attr("x1", d => 0.5 + x(d))
      .attr("x2", d => 0.5 + x(d))
      .attr("y1", margin.top)
      .attr("y2", configuration.height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
      .attr("y1", d => 0.5 + y(d))
      .attr("y2", d => 0.5 + y(d))
      .attr("x1", margin.left)
      .attr("x2", configuration.width - margin.right));

  svg.append("g")
    .call(grid);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);
  
  svg.append("g")
    .attr("stroke-width", 1.5)
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("transform", d => `translate(${x(new Date(d.datetime))},${y(d.ibin)})`)
    .attr("fill", d => color(d.lot))
    .attr("d", d => shape(d.lot));
};

export default d3Scatterplot;