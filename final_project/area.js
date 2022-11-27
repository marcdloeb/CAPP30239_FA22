/* D3 Area Chart */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);


Promise.all([
    d3.csv("data/chart_data/nbhood_year_street_addr_perc_extra_tall.csv"),
    d3.csv('long-term-interest-monthly.csv')
  ]).then(([str_addr_annual, interest]) => {
    console.log(str_addr_annual)
    neighborhoodMapping = d3.group(str_addr_annual, d => d.neighborhood)
    neighborhoodGroup = d3.groups(str_addr_annual, d => d.neighborhood)
    console.log(neighborhoodGroup)
    console.log(neighborhoodMapping)
    console.log("neighborhood data")
    neighborhood = neighborhoodMapping.get("black_belt")
    console.log(neighborhood)
    
    
    
    console.log("interest data")
    console.log(interest)

    let timeParse = d3.timeParse("%Y");

    for (let d of neighborhood) {
      d.percentage = +d.percentage;     // converting from string to number, I think
      d.year = timeParse(d.year);
  }


  let timeParse2 = d3.timeParse("%Y-%m");
    
    for (let d of interest) {
        d.Value = +d.Value;
        d.Date = timeParse2(d.Date);
    }

    console.log(interest)

    let x = d3.scaleTime()
      .domain(d3.extent(neighborhood, d => d.year))
      .range([margin.left, width - margin.right]);
    
    let y = d3.scaleLinear()
      .domain([0, d3.max(interest, d => d.percentage)])
      .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSizeOuter(0).tickSize(-width));

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Year");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    let area = d3.area()
      .x(d => x(d.year))
      .y0(y(0))
      .y1(d => y(d.percentage));

    svg.append("path")
      .datum(neighborhood)
      .attr("d", area)
      .attr("fill", "lightblue")
      .attr("stroke", "steelblue")
    
  });