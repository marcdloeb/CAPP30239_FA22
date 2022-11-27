let height2 = 600,
    width2 = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 30 })
    innerWidth = width2 - margin.left - margin.right;

const svg = d3.select("#connected_scatter")
  .append("svg")
  .attr("viewBox", [0, 0, width2, height2]);

Promise.all([
  d3.csv("data/chart_data/nbhood_decade_add_blackper_long.csv")
]).then(([str_addr_black_per]) => {

  let neighborhoods = new Set(); //creating a set of neighborhoods

  for (let d of str_addr_black_per) {
    d.black_per = +d.black_per;
    d.addr_share = +d.addr_share;
    neighborhoods.add(d.neighborhood); //looping through to add neighborhoods
  }

  console.log(str_addr_black_per)
  console.log(neighborhoods)

  multilineColor = d3.scaleOrdinal()
    .domain(neighborhoods)
    .range([["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]]);

  console.log(multilineColor.domain())
  console.log(multilineColor.range())
  console.log(multilineColor("Black Belt"))

  let x = d3.scaleLinear()
    //.domain(d3.extent(str_addr_black_per, d => d.black_per))
    .domain(d3.extent([0,100])).nice()
    .range([margin.left, width2 - margin.right]);

  let y = d3.scaleSqrt()
    //.domain(d3.extent(str_addr_black_per, d => d.addr_share))
    .domain(d3.extent([0,80])).nice()
    .range([height2 - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height2 - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(-innerWidth).tickFormat(d => d + "%"));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(d => d + "%"));

  let line = d3.line()
    .x(d => x(d.black_per))
    .y(d => y(d.addr_share))
    .curve(d3.curveCatmullRom); //setting type of curve

  for (let neighborhood of neighborhoods) { //going through set, creating a line for each country
    let neighborhoodData = str_addr_black_per.filter(d => d.neighborhood === neighborhood);

    console.log(neighborhood)

    let g = svg.append("g")
    //   .attr("class", "neighborhood")
    //   .on('mouseover', function () {
    //     d3.selectAll(".highlight").classed("highlight", false);
    //     d3.select(this).classed("highlight", true);
    //   });

    // if (neighborhood === "South Woodlawn") {
    //   g.classed("highlight", true);
    // }

    g.append("path")
      .datum(neighborhoodData)
      .attr("fill", "none")
      .attr("stroke", "pink")
      //.attr("stroke", multilineColor(d => d.neighborhood))
      .attr("d", line)

    let lastEntry = neighborhoodData[neighborhoodData.length - 1]; //last piece of data to position text x and y

    g.append("text")  //lining up the labels
      .text(neighborhood)
      .attr("x", x(lastEntry.black_per) + 3)
      .attr("y", y(lastEntry.addr_share))
      .attr("dominant-baseline", "middle")
      .attr("fill", "#999");
  }

  //adding scatter points
  svg.append("g")//appending an HTML element. Know it is HTML because of the quotes
    .attr("fill", "black")
    .selectAll("circle")
    .data(str_addr_black_per)
    .join("circle")//joining onto each circle
    .attr("cx", d => x(d.black_per))//how to position circles on x
    .attr("cy", d => y(d.addr_share))//how to position circles on y
    .attr("r", 2)
    .attr("opacity", 0.75); //making semi-transparent

  const tooltip = d3.select("body").append("div")//go to HTML, select the body tag
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "red");
      tooltip
        .style("visibility", "visible")
        .html(`${d.neighborhood}, ${d.decade}<br />Black Percentage: ${d.black_per}<br />Address Share: ${d.addr_share}`);//HTML literals
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "black");
      tooltip.style("visibility", "hidden");
    })
  
});