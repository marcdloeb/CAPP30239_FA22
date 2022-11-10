/* Bar chart representing total killed by state */

d3.json("data/a3cleanedonly2015.json").then(data => {
    
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

    console.log("hello")

    const height = 600,
        width = 800,
        margin = ({ top: 25, right: 30, bottom: 35, left: 50 });
        innerRadius = 175,
        outerRadius = 250,
        labelRadius = 275;
    

    let svg1 = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 
    
    let x = d3.scaleBand()
        .domain(newData.map(d => d.state)) // state data
        .range([margin.left, width - margin.right]) 
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(newData, d => d.count)]).nice() // state data totals
        .range([height - margin.bottom, margin.top]); 
    
    svg1.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg1.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg1.selectAll(".bar")
        .append("g")
        .data(newData)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") 
        .attr("fill", "lightyellow")
        .attr("x", d => x(d.state)) // state
        .attr("width", x.bandwidth())
        .attr("y", height-margin.bottom)
        .attr("height", 0)
        .transition() //adding an animation!
        .duration(1000)
        .attr("y", d => y(d.count)) // totals
        .attr("height", d => y(0) - y(d.count)) // totals
        .attr("fill", "gold"); //color transition
    
    bar.append('text') 
        .text(d => d.count) // totals
        .attr('x', d => x(d.state) + (x.bandwidth()/2)) //state
        .attr('y', d => y(d.count) - 5) // totals
        .attr('text-anchor', 'middle')
        .style('fill', 'black');

    // second chart

    //let x = d3.scaleBand()
    //.domain(newData.map(d => d.state)) 

    newData.sort((a, b) => b.count - a.count);

    console.log(newData)
    newData = newData.slice(0, 10)//taking the top 10
    console.log(newData)

    const arcs = d3.pie().value(d => d.count)(newData);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);//arc generator
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg2 = d3.select("#chart2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg2.append("g")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(arcs)
        .join("path")//start of data join
        .attr("fill", (d, i) => d3.schemeSet3[i])//color scheme
        .attr("d", arc);

    svg2.append("g")
        .attr("font-size", 8)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")//way to do a line break with js, kludgy
        .data(d => {
        return [d.data.state, d.data.count];
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .attr("font-weight", (d, i) => i ? null : "bold")
        .text(d => d);

    svg2.append("text")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text("Killings by State")
        .style("font-size", 12);


    // third chart 

    const svg3 = d3.select("#chart3")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

});

d3.csv("data/a3states_race2015_v1.csv").then( data => {

    const height = 600,
    width = 800,
    margin = ({ top: 25, right: 30, bottom: 35, left: 50 })

    const svg3 = d3.select("#chart3")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    console.log(data)

    let x = d3.scaleBand(data.map(d => (d.State)),[margin.left, width - margin.right])//domain and range in the ()
    .padding([0.2]);

    let y = d3.scaleLinear([0,700],[height - margin.bottom, margin.top]);

    svg3.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))

    svg3.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

    const subgroups = data.columns.slice(1);//getting rid of first group
    console.log(subgroups)

    const color = d3.scaleOrdinal(subgroups,["#23171b","#2f9df5","#4df884","#dedd32","#f65f18","#900c00"]);//scale ordinal, yet another scale

    const stackedData = d3.stack()
    .keys(subgroups)(data);

    svg3.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d.data.State))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width",x.bandwidth());

    let legendGroup = svg3//adding a legend
    .selectAll(".legend-group")
    .data(subgroups)
    .join("g")
    .attr("class", "legend-group");

    legendGroup
    .append("circle")
    .attr("cx", (d, i) => (10 + (i * 75)))
    .attr("cy",10)
    .attr("r", 3)
    .attr("fill", (d, i) => color(i));

    legendGroup
    .append("text")
    .attr("x", (d, i) => (20 + (i * 75)))
    .attr("y",15)
    .text((d, i) => subgroups[i]);

});