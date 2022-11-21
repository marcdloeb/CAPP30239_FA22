let height = 400, //setting variables
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
  
const svg = d3.select("#chart") //selecting the chart ID from HTML, appending SVG with a view box
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('data/chart_data/nbhood_decade_add_blackper_long.csv').then(data => {   //getting data
  
    console.log(data)

    neighborhoodGroup = d3.group(data, d => d.neighborhood)
    console.log(neighborhoodGroup)
    console.log(neighborhoodGroup.get("Black Belt"))

    for (let d of tracts_1920.features){
        //console.log(d.properties.black_per)
        //console.log(d.id)
        dataById[d.id] = d.properties
      }

    const myColor = d3.scaleOrdinal()
        .domain(neighborhoodGroup)
        .range(d3.schemeSet2);

    console.log(myColor)


    let x = d3.scaleLinear() //setting the x-scale
        .domain(d3.extent(data, d => d.black_per)).nice() //domain = data set
        .range([margin.left, width - margin.right]);  //range = space data takes on the page

    let y = d3.scaleSqrt() //going the same thing on the y-scale
        //.domain(d3.extent(data, d => d.addr_share)).nice() //d3.extent does max and min
        .domain(d3.extent([0,90])).nice()
        .range([height - margin.bottom, margin.top]);

        console.log(d3.extent(data, d => d.addr_share))

    svg.append("g") //creating x-axis
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x).tickFormat(d => (d) + "%").tickSize(-height + margin.top + margin.bottom))// tick size w/ a negative gives it the grid

    svg.append("g") //creating y-axis
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d => (d) + "%").tickSize(-width + margin.left + margin.right))

    svg.append("g")//appending an HTML element. Know it is HTML because of the quotes
        .attr("fill", "black")
        .selectAll("circle")
        .data(data)
        .join("circle")//joining onto each circle
        .attr("cx", d => x(d.black_per))//how to position circles on x
        .attr("cy", d => y(d.addr_share))//how to position circles on y
        .attr("r", 2)
        .attr("opacity", 0.75); //making semi-transparent

    // Add the lines
    const line = d3.line()
      .x(function(d) { return x(+d.black_per) })
      .y(function(d) { return y(+d.addr_share) })
    svg.selectAll("myLines")
      .data(neighborhoodGroup)
      .enter()
      .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.key) })
        .style("stroke-width", 4)
        .style("fill", "none")

    console.log(neighborhoodGroup.values)

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