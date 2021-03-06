var d3 = require("d3");
var d3Scatterpfoo = {};

d3Scatterpfoo.create = (el, data, configuration) => {
  d3Scatterpfoo.update(el, data, configuration)
};

d3Scatterpfoo.update = (el, data, configuration) => {
  const margin = ({top: 25, right: 20, bottom: 35, left: 40})
            
  d3.select(el)
    .append("svg")
    .attr("viewBox", [0, 0, configuration.width, configuration.height]);

  var svg = d3.select(el).select("svg")

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime)).nice()
    .range([margin.left, configuration.width - margin.right])

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.val)).nice()
    .range([configuration.height - margin.bottom, margin.top])

  const color = d3.scaleOrdinal(data.map(d => d.foo), d3.schemeCategory10)
  const shape = d3.scaleOrdinal(data.map(d => d.foo), d3.symbols.map(s => d3.symbol().type(s)()))

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
      .text(data.val))

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

  const gGrid = svg.append("g")
    .call(grid);

  const gx = svg.append("g")
    .call(xAxis);

  const gy = svg.append("g")
    .call(yAxis);
  
  const gDot = svg.append("g")
    .attr("stroke-width", 1.5)
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("transform", d => `translate(${x(d.datetime)},${y(d.val)})`)
    .attr("fill", d => color(d.foo))
    .attr("d", d => shape(d.foo));

  const delaunay = d3.Delaunay
    .from(data, d => x(d.datetime), d => y(d.val))

  const tooltip = svg.append("g")

  svg.on("touchmove mousemove", function(event) {
    const mouse = d3.pointer(event, this),
          nearest = delaunay.find(...mouse),
          point = data[nearest]

    if(point !== undefined) {
      const {datetime, val, foo, bar} = point

      tooltip.attr("transform", `translate(${x(datetime)},${y(val)})`)
        .call(callout, `Val: ${val}
        Foo: ${foo}
        Bar: ${bar}
        ${formatDate(datetime)}`);
    }
  });
  
  svg.on("touchend mouseleave", () => tooltip.call(callout, null));

  const callout = (g, value) => {
    if (!value) return g.style("display", "none");
  
    g.style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");
  
    const path = g.selectAll("path")
      .data([null])
      .join("path")
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("opacity", 0.5);
  
    const text = g.selectAll("text")
      .data([null])
      .join("text")
      .call(text => text
        .selectAll("tspan")
        .data((value + "").split(/\n/))
        .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => `${i * 1.1}em`)
          .style("font-weight", (_, i) => i ? null : "bold")
          .text(d => d));
  
    const {x, y, width: w, height: h} = text.node().getBBox();
  
    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }

  function formatDate(date) {
    return date.toLocaleString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  }
};

export default d3Scatterpfoo;