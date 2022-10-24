/* D3 Area Chart */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

//loading in CSV
d3.csv('long-term-interest-canada.csv').then(data => {
    let timeParse = d3.timeParse("%Y-%m");
    
    //iterating through the csv
    //Num = monthly interest rate
    for (let d of data) {
        d.Num = +d.Num;
        d.Month = timeParse(d.Month);
    }

    //setting x axis to be a time scale
    let x = d3.scaleTime()
      //domain = data to include
      //Months
      .domain(d3.extent(data, d => d.Month))
      .range([margin.left, width - margin.right]);
    
    //setting y axis to interest rates
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Num)])
      .range([height - margin.bottom, margin.top]);
    
    //adding bottom ticks
      svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    
    //adding top ticks
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSizeOuter(0).tickSize(-width));

    //labing the x axis
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Month");
    
    //labling the y axis
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    //creating the line and shaddded area
    let area = d3.area()
      .x(d => x(d.Month))
      .y0(y(0))
      .y1(d => y(d.Num));

    //coloring the area
    svg.append("path")
      .datum(data)
      .attr("d", area)
      //pink fill and light blue stroke
      .attr("fill", "lightpink")
      .attr("stroke", "lightblue")
    
  });