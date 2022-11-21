const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 900,
  width = 450;

Promise.all([
  d3.json("data/map_topos/race_tracts.json"),
  d3.json("data/map_topos/nbhood_street_addr_decades.json"),
]).then(([race_tracts, str_addr]) => {
  rto = race_tracts.objects
  sao = str_addr.objects
  console.log(rto)
  console.log(sao)
  map_addr_only(race_tracts, rto.race_1920_tract_id, str_addr, sao.nbhood_street_addr_1902_1914_id, "1902-1914", "No Census Data", '#row1'); //temp using 1920 (without race coloration) as a basemap 
  map_addr_blackper(race_tracts, rto.race_1920_tract_id, str_addr, sao.nbhood_street_addr_1915_1925_id, "1915-1925", "1920", '#row1');
  map_addr_blackper(race_tracts, rto.race_1930_tract_id, str_addr, sao.nbhood_street_addr_1926_1935_id, "1926-1935", "1930", '#row2');
  map_addr_blackper(race_tracts, rto.race_1940_tract_id, str_addr, sao.nbhood_street_addr_1936_1945_id, "1936-1945", "1940", '#row2');
  map_addr_blackper(race_tracts, rto.race_1950_tract_id, str_addr, sao.nbhood_street_addr_1946_1955_id, "1946-1955", "1950", '#row3');
  map_addr_blackper(race_tracts, rto.race_1960_tract_id, str_addr, sao.nbhood_street_addr_1956_1965_id, "1956-1965", "1960", '#row3');
  map_addr_blackper(race_tracts, rto.race_1970_tract_id, str_addr, sao.nbhood_street_addr_1966_1975_id, "1966-1975", "1970", '#row4');
  map_addr_blackper(race_tracts, rto.race_1980_tract_id, str_addr, sao.nbhood_street_addr_1976_1986_id, "1976-1986", "1980", '#row4');
});

//making a function that we will run multiple times

function map_addr_blackper(race_tracts, race_tracts_decade, str_addr, str_addr_decade, decade, census, elemId) {

  const tracts = topojson.feature(race_tracts, race_tracts_decade)
  const addr = topojson.feature(str_addr, str_addr_decade)

  const dataById = {}
  for (let d of tracts.features){
    //console.log(d.properties.black_per)
    //console.log(d.id)
    dataById[d.id] = d.properties
  }

  // //Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize() //breaks up dominate into buckets
    .domain([0, 100])
    .range(["#ffffff","#f7fbff","#e3eef9","#cfe1f2","#b5d4e9","#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa"]);
    //modified blue color scale

    const mesh = topojson.mesh(race_tracts, race_tracts_decade);
    // const projection = d3.geoMercator()
    //   .fitSize([width, height], mesh);
    // const projection = d3.geoAlbers()
    //   .fitSize([width, height], mesh);
    const projection = d3.geoIdentity() //I tried a dozen different projections, none work
      .angle(179)
      .reflectX(180)
      .fitSize([width, height], mesh);
    const path = d3.geoPath().projection(projection).pointRadius(1.5);

  const svg = d3.select(elemId)
    .append("div")
    .html(`<h3>Street Address ${decade}, Black Population ${census}</h3>`)
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
    .attr("stroke-width", 0.4);

  //adding street address points
  svg.append("g")
    .selectAll("path")
    .data(addr.features)
    .join("path")
    .attr("r", 10) //this does not work, this doesn't actually change radius
    .attr("fill", "#dd1c77")
    .attr("d", path)
    // .attr("stroke", "black")
    // .attr("stroke-width", 0.4)
    .attr("opacity", 0.5)
}

//this is identical except for a single line with the function above, is there any way that I can pass it some kind of boolean???
function map_addr_only(race_tracts, race_tracts_decade, str_addr, str_addr_decade, decade, census, elemId) {

  const tracts = topojson.feature(race_tracts, race_tracts_decade)
  const addr = topojson.feature(str_addr, str_addr_decade)

    const mesh = topojson.mesh(race_tracts, race_tracts_decade);
    // const projection = d3.geoMercator()
    //   .fitSize([width, height], mesh);
    // const projection = d3.geoAlbers()
    //   .fitSize([width, height], mesh);
    const projection = d3.geoIdentity() //I tried a dozen different projections, none work
      .angle(179)
      .reflectX(180)
      .fitSize([width, height], mesh);
    const path = d3.geoPath().projection(projection).pointRadius(1.75);

  const svg = d3.select(elemId)
    .append("div")
    .html(`<h3>Street Addresss From ${decade}, ${census}</h3>`)
    .attr("class", "chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  //adding census tracts
  svg.append("g")
    .selectAll("path")
    .data(tracts.features)
    .join("path")
    .attr("fill", "white")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", 0.4);

  //adding street address points
  svg.append("g")
    .selectAll("path")
    .data(addr.features)
    .join("path")
    .attr("r", 10) //this does not work, this doesn't actually change radius
    .attr("fill", "#dd1c77")
    .attr("d", path)
    // .attr("stroke", "black")
    // .attr("stroke-width", 0.4) //would it be possible to use the stroke width to modulate the points by the quantity?
    .attr("opacity", 0.5)
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