/* Bar chart representing total killed by state */

d3.json("a3cleanedonly2015.json").then(data => {
    
    console.log(data);
    
    // let newData = [
    //     { armed: '', count: 0 },
    //     { armed: 'Knife', count: 0 },
    //     { armed: 'Gun', count: 0 },
    //     { armed: 'Unknown Weapon', count: 0 },
    //     { armed: 'Hammer', count: 0 },
    //     { armed: 'Unarmed', count: 0 },
    //     { armed: 'Vehicle', count: 0 },
    //     { armed: 'Toy Weapon', count: 0 },
    //     { armed: 'Machete', count: 0 },
    //     { armed: 'Sword', count: 0 },
    //     { armed: 'Chain', count: 0 },
    //     { armed: 'Guns And Explosives', count: 0 },
    //     { armed: 'Nail Gun', count: 0 },
    //     { armed: "Contractor'S Level", count: 0 },
    //     { armed: 'Metal Pipe', count: 0 },
    //     { armed: 'Metal Object', count: 0 },
    //     { armed: 'Metal Stick', count: 0 },
    //     { armed: 'Blunt Object', count: 0 },
    //     { armed: 'Hatchet', count: 0 },
    //     { armed: 'Box Cutter', count: 0 },
    //     { armed: 'Cordless Drill', count: 0 },
    //     { armed: 'Metal Pole', count: 0 },
    //     { armed: 'Crossbow', count: 0 },
    //     { armed: 'Screwdriver', count: 0 },
    //     { armed: 'Tasered', count: 0 },
    //     { armed: 'Straight Edge Razor', count: 0 },
    //     { armed: 'Beer Bottle', count: 0 }
    // ];

    // for(var d of data) {
    //     let nd = newData.find(nd => nd.armed == d["Armed"]);
    //     nd.count += 1;
    // }
    // console.log(newData)


    // Aggregating data by state, kind of a clunky way of doing this
    //let stateData = [
    let newData = [
        { state: 'WA', count: 0 },
        { state: 'TX', count: 0 },
        { state: 'CO', count: 0 },
        { state: 'CA', count: 0 },
        { state: 'NY', count: 0 },
        { state: 'LA', count: 0 },
        { state: 'MN', count: 0 },
        { state: 'PA', count: 0 },
        { state: 'OH', count: 0 },
        { state: 'AR', count: 0 },
        { state: 'VA', count: 0 },
        { state: 'IN', count: 0 },
        { state: 'AZ', count: 0 },
        { state: 'OK', count: 0 },
        { state: 'MO', count: 0 },
        { state: 'MD', count: 0 },
        { state: 'TN', count: 0 },
        { state: 'NC', count: 0 },
        { state: 'FL', count: 0 },
        { state: 'AL', count: 0 },
        { state: 'MS', count: 0 },
        { state: 'WI', count: 0 },
        { state: 'GA', count: 0 },
        { state: 'SC', count: 0 },
        { state: 'MA', count: 0 },
        { state: 'KY', count: 0 },
        { state: 'IL', count: 0 },
        { state: 'NJ', count: 0 },
        { state: 'MI', count: 0 },
        { state: 'NE', count: 0 },
        { state: 'NV', count: 0 },
        { state: 'HI', count: 0 },
        { state: 'WV', count: 0 },
        { state: 'UT', count: 0 },
        { state: 'DE', count: 0 },
        { state: 'DC', count: 0 },
        { state: 'OR', count: 0 },
        { state: 'KS', count: 0 },
        { state: 'AK', count: 0 },
        { state: 'NM', count: 0 },
        { state: 'ID', count: 0 },
        { state: 'IA', count: 0 },
        { state: 'ND', count: 0 },
        { state: 'SD', count: 0 },
        { state: 'WY', count: 0 },
        { state: 'MT', count: 0 },
        { state: 'ME', count: 0 },
        { state: 'CT', count: 0 },
        { state: 'NH', count: 0 },
        { state: 'VT', count: 0 },

    ];

//getting errors when I change the name
//     for(var d of data) {
//         let sd = stateData.find(sd => sd.race == d["Armed"]);
//         sd.count += 1;
//    }
//    console.log(stateData)

    for(var d of data) {
        let nd = newData.find(nd => nd.state == d["State"]);
        nd.count += 1;
    }
    console.log(newData)


    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 
    
    let x = d3.scaleBand()
        .domain(newData.map(d => d.state)) // state data
        .range([margin.left, width - margin.right]) 
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(newData, d => d.count)]).nice() // state data totals
        .range([height - margin.bottom, margin.top]); 
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar")
        .append("g")
        .data(newData)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") 
        .attr("fill", "gold")
        .attr("x", d => x(d.state)) // state
        .attr("width", x.bandwidth()) 
        .attr("y", d => y(d.count)) // totals
        .attr("height", d => y(0) - y(d.count)); // totals
    
    bar.append('text') 
        .text(d => d.count) // totals
        .attr('x', d => x(d.state) + (x.bandwidth()/2)) //state
        .attr('y', d => y(d.count) - 5) // totals
        .attr('text-anchor', 'middle')
        .style('fill', 'black');

});