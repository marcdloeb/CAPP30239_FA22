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
  d3.json("data/map_topos/race_tracts_albers.json"),
]).then(([data, us, race_tracts]) => {//"data comes from the csv, us comes from the topojson"
  console.log(race_tracts)
  console.log(us)
  
  // const dataById = {};

  // for (let d of data) {
  //   d.rate = +d.rate; //coercing the data format
  //   //making a lookup table from the array (unemployment data)
  //   dataById[d.id] = d;
  // }

  // console.log(dataById)

  //  us.objects.states.geometries = us.objects.states.geometries.filter(d => d.properties.name === "Arizona");

  //const tracts_1920_geojson
  const tracts_1920 = topojson.feature(race_tracts, race_tracts.objects.race_1920_tract_albers)
  const counties = topojson.feature(us, us.objects.counties);
  console.log(counties.features)
  console.log(tracts_1920.features)

  // //Quantize evenly breakups domain into range buckets
  // const color = d3.scaleQuantize() //breaks up dominate into buckets
  //   .domain([0, 10]).nice() //breaking up into 1% buckets
  //   .range(d3.schemeBlues[9]);

  const path = d3.geoPath();

  ///////// code chunk that doesn't work for tracts //////
  // svg.append("g")
  // .selectAll("path")
  // .data(tracts_1920.features)
  // .join("path")
  // .attr("fill", "blue")
  // .attr("d", path)

///////////identical code with counties swapped in that does work////////
  svg.append("g")
  .selectAll("path")
  .data(counties.features)
  .join("path")
  .attr("fill", "blue")
  .attr("d", path)


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