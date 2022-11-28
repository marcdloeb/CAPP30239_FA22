let height2 = 600,
    width2 = 600,
    margin = ({ top: 25, right: 100, bottom: 35, left: 30 })
    innerWidth = width2 - margin.left - margin.right;

const svg9 = d3.select("#multi_line")
  .append("svg")
  .attr("viewBox", [0, 0, width2, height2]);

  Promise.all([
    d3.csv("data/chart_data/years_relative_addr_share.csv")
  ]).then(([str_addr_relative]) => {


  console.log(str_addr_relative)

  let timeParse = d3.timeParse("%Y");

  let neighborhoods = new Set(); //creating a set of neighborhoods

  for (let d of str_addr_relative) {
    d.rel_average_rolling = +d.rel_average_rolling;
    d.year = timeParse(d.year)
    neighborhoods.add(d.neighborhood); //looping through to add neighborhoods
  }

  console.log(neighborhoods)

  let x2 = d3.scaleTime()
    .domain(d3.extent(str_addr_relative, d => d.year))
    .range([margin.left, width2 - margin.right]);

  let y2 = d3.scaleSqrt()
    .domain(d3.extent([-100, 450]))
    //.domain(d3.extent(str_addr_relative, d => d.rel_average_rolling))
    .range([height2 - margin.bottom, margin.top]);

  svg9.append("g")
    .attr("transform", `translate(0,${height2 - margin.bottom})`)
    .call(d3.axisBottom(x2));

  svg9.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y2).tickSize(-innerWidth).tickFormat(d => d + "%"));

  let line2 = d3.line()
    .x(d => x2(d.year))
    .y(d => y2(d.rel_average_rolling))
    .curve(d3.curveBundle);
 
  for (let neighborhood of neighborhoods) { //going through set, creating a line for each neighborhood
    let neighborhoodData = str_addr_relative.filter(d => d.neighborhood === neighborhood);

    console.log(neighborhood)

    let g = svg9.append("g")
      .attr("class", "neighborhood")
      .on('mouseover', function () {
        d3.selectAll(".highlight").classed("highlight", false);
        d3.select(this).classed("highlight", true);
      });

    if (neighborhood === "South Woodlawn") {
      g.classed("highlight", true);
    }

    g.append("path")
      .datum(neighborhoodData)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      //.attr("stroke", multilineColor(d => d.neighborhood))
      .attr("d", line2)

    let lastEntry = neighborhoodData[neighborhoodData.length - 1]; //last piece of data to position text x and y

    g.append("text")  //lining up the labels
      .text(neighborhood)
      .attr("x", x2(lastEntry.year) + 1)
      .attr("y", y2(lastEntry.rel_average_rolling))
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }

  
});