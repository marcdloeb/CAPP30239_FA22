let height2 = 600, //setting variables
    width2 = 800,
    margin = ({ top: 25, right: 90, bottom: 35, left: 40 });
    innerWidth = width2 - margin.left - margin.right;
    //look around, find where margin right is set

const svg9 = d3.select("#multi_line")
    .append("svg")
    .attr("viewBox", [0, 0, width2, height2]);

const svg13 = d3.select("#connected_scatter") //selecting the chart ID from HTML, appending SVG with a view box
    .append("svg")
    .attr("viewBox", [0, 0, width2, height2]);

Promise.all([
  d3.csv("data/chart_data/nbhood_decade_add_blackper_long.csv"),
  d3.csv("data/chart_data/years_relative_addr_share.csv")
]).then(([str_addr_black_per, str_addr_relative]) => {
  //getting data
  
    let neighborhoods = new Set(); //creating a set of neighborhoods to color lines
    let census_decades = new Set(); //creasing a set of decades to color points

    for (let d of str_addr_black_per) {
      d.black_per = +d.black_per;
      d.addr_share = +d.addr_share;
      d.census_decade = +d.census_decade;
      neighborhoods.add(d.neighborhood); //looping through to add neighborhoods
      census_decades.add(d.census_decade); //looping through to add decades
    }

    console.log("street address black per")
    console.log(str_addr_black_per)
    console.log(neighborhoods)
    console.log(census_decades)

    multilineColor = d3.scaleOrdinal()
      .domain(neighborhoods)
      .range(["#1f77b4","#731603","#f52020","#ff7f0e","#4e2d6e","#e377c2"]);

    DecadesColor = d3.scaleOrdinal()
    .domain(census_decades)
    .range(["#440154","#443983","#31688e","#21918c","#35b779","#90d743","#fde725"]);

    let x = d3.scaleLinear()
        //.domain(d3.extent(str_addr_black_per, d => d.black_per))
        .domain(d3.extent([-5,100]))
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
    
        // console.log(neighborhood)
        // console.log(multilineColor(neighborhood))

        // console.log("neighborhood data")
        // console.log(neighborhoodData)
    
        let g = svg13.append("g")

        let lastEntry = neighborhoodData[neighborhoodData.length - 1]; //last piece of data to position text x and y
    
        g.append("text")  //lining up the labels
          .text(neighborhood)
          .attr("x", x(lastEntry.black_per) + 3)
          .attr("y", y(lastEntry.addr_share))
          .attr("dominant-baseline", "middle")
          .attr("fill", "#999");


          g.append("path")
          .datum(neighborhoodData)
          .attr("fill", "none")
          //.attr("stroke", "pink")
          .attr("stroke", (multilineColor(neighborhood)))
          .attr("stroke-width", 2)
          .attr("opacity", 0.75)
          .attr("d", line)
      }

    console.log('Decade blackper addr data')
    console.log(str_addr_black_per)
    console.log("Decades Color")
    console.log(DecadesColor("1920"))
    //circles
    svg13.append("g")
        .attr("fill", "black")
        .selectAll("circle")
        .data(str_addr_black_per)
        .join("circle")//joining onto each circle
        //.attr("fill", d => DecadesColor(d.census_decade), d => console.log("should be decade", d.census_decade))
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

    // svg.select("foreignObject").remove();
    // annotate(i);

    // function annotate(i) {
    //   let str = `test annotation`
  
    //   svg.append("foreignObject")
    //     .attr("x", 40)
    //     .attr("y", 120)
    //     .attr("width", 120)
    //     .attr("height", 100)
    //     .append('xhtml:div')
    //     .append("p")
    //     .html(str);

    // second chart!!!
    // multiline chart 

    console.log(str_addr_relative)

    let timeParse = d3.timeParse("%Y");

    for (let d of str_addr_relative) {
      d.rel_average_rolling = +d.rel_average_rolling;
      d.year = timeParse(d.year);
    }

    let x2 = d3.scaleTime()
    .domain(d3.extent(str_addr_relative, d => d.year))
    .range([margin.left, width2 - margin.right]);

    let y2 = d3.scaleLinear()
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

      if (neighborhood === "S. Woodlawn") {
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