/* Bar chart for COVID country cases */

d3.csv("covid.csv").then(data => {
    for (let d of data) {
        d.cases = +d.cases; //force a number
    };

    //setting constants to be used later
    const height = 600,
        width = 800,
        margin = ({top: 25, right: 30, bottom: 35, left: 50});

    //defining svg
    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    let x = d3.scaleBand()
        //using ananymous functions
        .domain(data.map(d => d.country))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)]).nice()
        .range([height - margin.bottom, margin.top]); //svgs are built from the top down

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar")

    bar.append("rect")
        .attr("fill", "steelblue")
        //x scale, giving it an x-position to go to based on country
        .attr("x", d => x(d.country))
        .attr("width", x.bandwidth)
        .attr("y", d => y(0) - y(d.cases))
        .attr("height", d => y(0) - y(d.cases));

    bar.append('text') // add labels
        .text(d => d.cases)
        .attr('x', d => x(d.country) + (x.bandwidth()/2))
        .attr('y', d => y(d.cases) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');

});

