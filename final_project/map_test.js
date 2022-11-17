const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

  //loading two files
Promise.all([
  d3.csv("test_data/unemployment2020.csv"),
  d3.json("libs/counties-albers-10m.json"),
  d3.json("data/map_topos/race_tracts.json"),
  d3.json("data/map_topos/nbhood_street_addr.json"),
]).then(([data, us, race_tracts, str_addr]) => {//"data comes from the csv, us comes from the topojson"
  console.log(race_tracts);
  console.log(us);
  console.log(str_addr);

  const tracts_1920 = topojson.feature(race_tracts, race_tracts.objects.race_1930_tract_id);
  const counties = topojson.feature(us, us.objects.counties);
  const addr = topojson.feature(str_addr, str_addr.objects.nbhood_street_addr);
  console.log("counties features");
  console.log(counties.features);
  console.log("1920 tract features");
  console.log(tracts_1920.features);
  console.log("street addresses")
  console.log(addr)


  const dataById = {}
  for (let d of tracts_1920.features){
    //console.log(d.properties.black_per)
    //console.log(d.id)
    dataById[d.id] = d.properties
  }
  console.log("databyid",dataById)
  
  // const dataById = {};

  // for (let d of data) {
  //   d.rate = +d.rate; //coercing the data format
  //   //making a lookup table from the array (unemployment data)
  //   dataById[d.id] = d;
  // }

  // //Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize() //breaks up dominate into buckets
    .domain([0, 100])
    .range(["#ffffff","#e1edf8","#cadef0","#abcfe6","#82badb","#59a1cf","#3787c0","#1c6aaf","#0b4d94","#08306b"]);

  const mesh = topojson.mesh(race_tracts, race_tracts.objects.race_1930_tract_id);
  // const projection = d3.geoMercator()
  //   .fitSize([width, height], mesh);
  const projection = d3.geoIdentity()
    .angle(179)
    .reflectX(180)
    .fitSize([width, height], mesh);
  const path = d3.geoPath().projection(projection);
  
  svg.append("g")
    .selectAll("path")
    .data(tracts_1920.features)
    .join("path")
    .attr("fill", "white")
    .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].black_per) : 'white')
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", 0.2);

  console.log("path",path)

  svg.append("g")
    .selectAll("path")
    .data(addr.features)
    .join("path")
    .attr("fill", "black")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", 0.2);

  



      // for(var d of data) {
    //      let nd = newData.find(nd => nd.race == d["Race"]);
    //      nd.count += 1;
    // }
    // console.log(newData)



///////////identical code with counties swapped in that does work////////
  // svg.append("g")
  // .selectAll("path")
  // .data(counties.features)
  // .join("path")
  // .attr("fill", "blue")
  // .attr("d", path)


  // svg.append("g")
  //   .selectAll("path")
  //   .data(counties.features)
  //   .join("path")
  //   .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc')
  //   .attr("d", path)

    // .on("mousemove", function (event, d) {
    //   let info = dataById[d.id];
    //   tooltip
    //     .style("visibility", "visible")
    //     .html(`${info.county}<br>${info.rate}%`)
    //     .style("top", (event.pageY - 10) + "px")
    //     .style("left", (event.pageX + 10) + "px");
    //   d3.select(this).attr("fill", "goldenrod");
    // })
    // .on("mouseout", function () {
    //   tooltip.style("visibility", "hidden");
    //   d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc');
    // });

    // d3.select("#legend")//building out the legend, being placed by the HTML
    // .node()
    // .appendChild(
    //   Legend(
    //     d3.scaleOrdinal(
    //       ["1", "2", "3", "4", "5", "6", "7", "8", "9+"], //these don't have to be numbers, could set to string, categories wouldn't change
    //       d3.schemeBlues[9] //number of colors
    //     ),
    //     { title: "Unemployment rate (%)" }
    //   ));
});