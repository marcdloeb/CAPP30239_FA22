/* Bar chart for Library Visits */

d3.csv("library_visits_jan22.csv").then(data => {

    // Number of library visits is the y-axis of thechart
    for (let d of data) {
        d.num = +d.num; //force a number
    };

    // Configuring page layout
    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser
    
    // Building x bar
    let x = d3.scaleBand()
        .domain(data.map(d => d.branch)) // data, returns array
        // Stretches along whole width of page, except margins
        .range([margin.left, width - margin.right]) // pixels on page
        .padding(0.1);
    
    // Building y bar
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.num)]).nice() // nice rounds the top num
        // Stretches along whole height of page, except margins
        .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed
    
    /* Update: simplfied axes */
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    // Gap between Y axis and the bars
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");
    
    // Creating rectangles
    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.branch)) // x position attribute
        .attr("width", x.bandwidth()) // this width is the width attr on the element
        .attr("y", d => y(d.num)) // y position attribute
        .attr("height", d => y(0) - y(d.num)); // this height is the height attr on element
    
    // Adding labels to chart
    bar.append('text')
        .text(d => d.num)
        // Making use of bandwidth to set x-axis labels
        .attr('x', d => x(d.branch) + (x.bandwidth()/2))
        // Making use of y values to set label height
        .attr('y', d => y(d.num) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});