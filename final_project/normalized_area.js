let width2 = 900,
    height2 = 450,
    margin2 = {top: 20, right: 20, bottom: 30, left: 50}


const svg2 = d3.select("#normalized_area")
    .append("svg")
    .attr("viewBox", [0, 0, width2, height2]);

d3.csv("data/chart_data/nbhood_year_street_addr_perc_tall.csv").then(data => {
    var parseDate = d3.timeParse("%Y");

    var x = d3.scaleTime().range([0, width2]),
        y = d3.scaleLinear().range([height2, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);
    
    var stack = d3.stack();
    
    var area = d3.area()
        .x(function(d, i) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); });
    
    var g = svg2.append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  var keys = data.columns.slice(2);

  x.domain(d3.extent(data, function(d) { return d.year; }));
  z.domain(keys);
  stack.keys(keys);

  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  layer.append("path")
      .attr("class", "area")
      .style("fill", function(d) { return z(d.key); })
      .attr("d", area);

  layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
    .append("text")
      .attr("x", width2 - 6)
      .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));
});

function type(d, i, columns) {
  d.year = parseDate(d.year);
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
  return d;
}
