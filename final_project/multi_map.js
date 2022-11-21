const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

let counties;

Promise.all([
  d3.json("data/map_topos/race_tracts.json"),
  d3.json("data/map_topos/nbhood_street_addr_decades.json"),
]).then(([race_tracts, str_addr]) => {
  rto = race_tracts.objects
  sao = str_addr.objects
  console.log(rto)
  console.log(sao)
  createChart(race_tracts, rto.race_1920_tract_id, str_addr, sao.nbhood_street_addr_1915_1925_id, "1915-1925", '#row1');
  createChart(race_tracts, rto.race_1930_tract_id, str_addr, sao.nbhood_street_addr_1926_1935_id, "1926-1935", '#row1');
  createChart(race_tracts, rto.race_1940_tract_id, str_addr, sao.nbhood_street_addr_1936_1945_id, "1936-1945", '#row1');
  createChart(race_tracts, rto.race_1950_tract_id, str_addr, sao.nbhood_street_addr_1946_1955_id, "1946-1955", '#row1');
  createChart(race_tracts, rto.race_1960_tract_id, str_addr, sao.nbhood_street_addr_1956_1965_id, "1956-1965", '#row2');
  createChart(race_tracts, rto.race_1970_tract_id, str_addr, sao.nbhood_street_addr_1966_1975_id, "1966-1975", '#row2');
  createChart(race_tracts, rto.race_1980_tract_id, str_addr, sao.nbhood_street_addr_1976_1986_id, "1976-1986", '#row2');
});

//making a function that we will run multiple times

function createChart(race_tracts, race_tracts_decade, str_addr, str_addr_decade, decade, elemId) {

  const tracts = topojson.feature(race_tracts, race_tracts_decade)
  const addr = topojson.feature(str_addr, str_addr_decade)

  console.log(tracts)
  console.log(addr)

  const dataById = {}
  for (let d of tracts.features){
    //console.log(d.properties.black_per)
    //console.log(d.id)
    dataById[d.id] = d.properties
  }
  console.log("databyid",dataById)

  // //Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize() //breaks up dominate into buckets
    .domain([0, 100])
    .range(["#ffffff","#e1edf8","#cadef0","#abcfe6","#82badb","#59a1cf","#3787c0","#1c6aaf","#0b4d94","#08306b"]);
    //blue color scale modified to make 0-10% equal white, which I think looks better

    const mesh = topojson.mesh(race_tracts, race_tracts_decade);
    // const projection = d3.geoMercator()
    //   .fitSize([width, height], mesh);
    // const projection = d3.geoAlbers()
    //   .fitSize([width, height], mesh);
    const projection = d3.geoIdentity() //I tried a dozen different projections, none work
      .angle(179)
      .reflectX(180)
      .fitSize([width, height], mesh);
    const path = d3.geoPath().projection(projection);

  const svg = d3.select(elemId)
    .append("div")
    .html(`<h3>${decade}</h3>`)
    .attr("class", "chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  //adding census tracts
  svg.append("g")
    .selectAll("path")
    .data(tracts.features)
    .join("path")
    .attr("fill", "white")
    .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].black_per) : 'white')
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", 0.2);

  //adding street address points
  svg.append("g")
    .selectAll("path")
    .data(addr.features)
    .join("path")
    .attr("r", 10) //this does not work, this doesn't actually change radius
    .attr("fill", "red")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("opacity", 0.7)
}

d3.select("#legend")
  .node()
  .appendChild(
    Legend(
      d3.scaleOrdinal(
        ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
        ["#ffffff","#e1edf8","#cadef0","#abcfe6","#82badb","#59a1cf","#3787c0","#1c6aaf","#0b4d94","#08306b"]
      ),
      { title: "Percent Black (%)" }
    ));