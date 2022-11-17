let height = 400, //setting variables
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg = d3.select("#chart") //selecting the chart ID from HTML, appending SVG with a view box
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('penguins.csv').then(data => {   //getting data
  
    console.log(data)

    const islands = ["Torgersen", "Biscoe", "Dream"]

    var Color = d3.scaleOrdinal()
      .domain(islands)
      .range(d3.schemeSet2);

    let x = d3.scaleLinear() //setting the x-scale
        .domain(d3.extent(data, d => d.body_mass_g)).nice() //domain = data set
        .range([margin.left, width - margin.right]);  //range = space data takes on the page

    let y = d3.scaleLinear() //going the same thing on the y-scale
        .domain(d3.extent(data, d => d.flipper_length_mm)).nice() //d3.extent does max and min
        .range([height - margin.bottom, margin.top]);

    svg.append("g") //creating x-axis
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x).tickFormat(d => (d/1000) + "kg").tickSize(-height + margin.top + margin.bottom))// tick size w/ a negative gives it the grid

    svg.append("g") //creating y-axis
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

    svg.append("g")//appending an HTML element. Know it is HTML because of the quotes
        .attr("fill", "black")
        .selectAll("circle")
        .data(data)
        .join("circle")//joining onto each circle
        .attr("cx", d => x(d.body_mass_g))//how to position circles on x
        .attr("cy", d => y(d.flipper_length_mm))//how to position circles on y
        .attr("r", 2)
        .attr("opacity", 0.75); //making semi-transparent

//   const tooltip = d3.select("body").append("div")//go to HTML, select the body tag
//     .attr("class", "svg-tooltip")
//     .style("position", "absolute")
//     .style("visibility", "hidden");

//   d3.selectAll("circle")
//     .on("mouseover", function(event, d) {
//       d3.select(this).attr("fill", "red");
//       tooltip
//         .style("visibility", "visible")
//         .html(`Species: ${d.species}<br />Island: ${d.island}<br />Weight: ${d.body_mass_g/1000}kg`);//HTML literals
//     })
//     .on("mousemove", function(event) {
//       tooltip
//         .style("top", (event.pageY - 10) + "px")
//         .style("left", (event.pageX + 10) + "px");
//     })
//     .on("mouseout", function() {
//       d3.select(this).attr("fill", "black");
//       tooltip.style("visibility", "hidden");
//     })
    
});