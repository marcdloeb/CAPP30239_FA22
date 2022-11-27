let height2 = 600, //setting variables
    width2 = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg13 = d3.select("#connected_scatter") //selecting the chart ID from HTML, appending SVG with a view box
    .append("svg")
    .attr("viewBox", [0, 0, width2, height2]);

Promise.all([
  d3.csv("data/chart_data/nbhood_decade_add_blackper_long.csv")
]).then(([str_addr_black_per]) => {
  //getting data
  
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
        .domain(d3.extent([-10,100])).nice()
        .range([margin.left, width2 - margin.right]);

    let y = d3.scaleSqrt()
        //.domain(d3.extent(str_addr_black_per, d => d.addr_share))
        .domain(d3.extent([0,90])).nice()
        .range([height2 - margin.bottom, margin.top]);

        console.log(d3.extent(str_addr_black_per, d => d.addr_share))

    svg13.append("g") //creating x-axis
        .attr("transform", `translate(0,${height2 - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x).tickFormat(d => (d) + "%").tickSize(-height2 + margin.top + margin.bottom))// tick size w/ a negative gives it the grid

    svg13.append("g") //creating y-axis
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d => (d) + "%").tickSize(-width2 + margin.left + margin.right))


    let line = d3.line()
        .x(d => x(d.black_per))
        .y(d => y(d.addr_share))
        .curve(d3.curveCatmullRom); //setting type of curve

    for (let neighborhood of neighborhoods) { //going through set, creating a line for each neighborhood
        let neighborhoodData = str_addr_black_per.filter(d => d.neighborhood === neighborhood);
    
        console.log(neighborhood)
    
        let g = svg13.append("g")
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

    svg13.append("g")//appending an HTML element. Know it is HTML because of the quotes
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