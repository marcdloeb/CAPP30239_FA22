const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 500,
  width = 250

Promise.all([
  d3.json("data/map_topos/race_tracts.json"),
  d3.json("data/map_topos/nbhood_street_addr_decades.json"),
  d3.json("data/map_topos/chicago_neighborhood_polys_id.json"),
  d3.json("data/map_topos/parks.json")
]).then(([race_tracts, str_addr, nbhood_polys, parks]) => {
   
  //setting up choropleth data
  console.log("parks")
  console.log(parks)
  console.log("neighborhood polygons")
  console.log(nbhood_polys)
  rto = race_tracts.objects
  sao = str_addr.objects
  console.log("race tracts")
  console.log(rto)
  console.log("street address points")
  console.log(sao)

  //call choropleth functions
  choro_addr_only(parks, race_tracts, rto.race_1920_tract_id, str_addr, sao.nbhood_street_addr_1902_1914_id, "1902-1914", "No Race Census Data", '#row1'); //temp using 1920 (without race coloration) as a basemap 
  choro_addr_blackper(parks, race_tracts, rto.race_1920_tract_id, str_addr, sao.nbhood_street_addr_1915_1925_id, "1915-1925", "1920", '#row1');
  choro_addr_blackper(parks, race_tracts, rto.race_1930_tract_id, str_addr, sao.nbhood_street_addr_1926_1935_id, "1926-1935", "1930", '#row1');
  choro_addr_blackper(parks, race_tracts, rto.race_1940_tract_id, str_addr, sao.nbhood_street_addr_1936_1945_id, "1936-1945", "1940", '#row2');
  choro_addr_blackper(parks, race_tracts, rto.race_1950_tract_id, str_addr, sao.nbhood_street_addr_1946_1955_id, "1946-1955", "1950", '#row2');
  choro_addr_blackper(parks, race_tracts, rto.race_1960_tract_id, str_addr, sao.nbhood_street_addr_1956_1965_id, "1956-1965", "1960", '#row2');
  choro_addr_blackper(parks, race_tracts, rto.race_1970_tract_id, str_addr, sao.nbhood_street_addr_1966_1975_id, "1966-1975", "1970", '#row3');
  choro_addr_blackper(parks, race_tracts, rto.race_1980_tract_id, str_addr, sao.nbhood_street_addr_1976_1986_id, "1976-1986", "1980", '#row3');
  choro_neighborhood_polys(parks, nbhood_polys, race_tracts, rto.race_1980_tract_id, '#row3');
});

//making a function that we will run multiple times

function choro_addr_blackper(parks, race_tracts, race_tracts_decade, str_addr, str_addr_decade, decade, census, elemId) {

  const tracts = topojson.feature(race_tracts, race_tracts_decade)
  const addr = topojson.feature(str_addr, str_addr_decade)
  const park_poly = topojson.feature(parks, parks.objects.parks)

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
    const path = d3.geoPath().projection(projection).pointRadius(1.1);

  const svg = d3.select(elemId)
    .append("div")
    .html(`<h3>Street Address From ${decade}, Black Population ${census}</h3>`)
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

  //adding parks
  svg.append("g")
    .selectAll("path")
    .data(park_poly.features)
    .join("path")
    .attr("fill", "#c4ed95")
    .attr("d", path);

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
function choro_addr_only(parks, race_tracts, race_tracts_decade, str_addr, str_addr_decade, decade, census, elemId) {

  const tracts = topojson.feature(race_tracts, race_tracts_decade)
  const addr = topojson.feature(str_addr, str_addr_decade)
  const park_poly = topojson.feature(parks, parks.objects.parks)

    const mesh = topojson.mesh(race_tracts, race_tracts_decade);
    // const projection = d3.geoMercator()
    //   .fitSize([width, height], mesh);
    // const projection = d3.geoAlbers()
    //   .fitSize([width, height], mesh);
    const projection = d3.geoIdentity() //I tried a dozen different projections, none work
      .angle(179)
      .reflectX(180)
      .fitSize([width, height], mesh);
    const path = d3.geoPath().projection(projection).pointRadius(1.1);

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

  //adding parks
  svg.append("g")
    .selectAll("path")
    .data(park_poly.features)
    .join("path")
    .attr("fill", "#c4ed95")
    .attr("d", path);

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

function choro_neighborhood_polys(parks, nbhood_polys, race_tracts, race_tracts_decade, elemId) {

  // console.log(race_tracts_decade)
  // console.log(nbhood_polys.objects.chicago_neighborhood_polys)

  const tracts = topojson.feature(race_tracts, race_tracts_decade)
  const park_poly = topojson.feature(parks, parks.objects.parks)
  const nbhoods = topojson.feature(nbhood_polys, nbhood_polys.objects.chicago_neighborhood_polys_id)
  console.log(nbhoods)
  console.log(park_poly)

  // let nbhoods_names = new Set(['Black Belt', 'N.  Woodlawn', 'Hyde Park', 'S.  Kenwood', 'N.  Kenwood', 'South Shore', 'S.  Woodlawn']);
  // console.log(nbhoods_names)
  
  let nbhoods_names = new Set()

  const NbhoodById = {}
  for (let d of nbhoods.features){
    console.log(d.properties.name)
    console.log(d.id)
    nbhoods_names.add(d.properties.name)
    NbhoodById[d.id] = d.properties
  }

  console.log(nbhoods_names)
  console.log(NbhoodById)

  NbhoodNamesColor = d3.scaleOrdinal()
  .domain(nbhoods_names)
  .range(["#1f77b4","#f52020", "#731603","#ff7f0e","#074228", "#4e2d6e","#e377c2"]);

  // console.log("color test")
  // console.log(NbhoodNamesColor('Black Belt'))
  // console.log(NbhoodNamesColor('Hyde Park'))

    const mesh = topojson.mesh(race_tracts, race_tracts_decade);
    // const projection = d3.geoMercator()
    //   .fitSize([width, height], mesh);
    // const projection = d3.geoAlbers()
    //   .fitSize([width, height], mesh);
    const projection = d3.geoIdentity() //I tried a dozen different projections, none work
      .angle(179)
      .reflectX(180)
      .fitSize([width, height], mesh);
    const path = d3.geoPath().projection(projection).pointRadius(1.1);

  const svg = d3.select(elemId)
    .append("div")
    .html(`<h3>Neighborhoods Used to Sum Address Points for Charts</h3>`)
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

  svg.append("g")
    .selectAll("path")
    .data(nbhoods.features)
    .join("path")
    //.attr("fill", "black")
    //.attr("fill", d => NbhoodNamesColor(d.name), d => console.log("should be name", d.name), d => console.log("should be color", NbhoodNamesColor(d.name)))
    .attr("fill", d => (d.id in NbhoodById) ? NbhoodNamesColor(NbhoodById[d.id].name) : 'white')
    .attr("d", path);

  svg.append("g")
    .selectAll("path")
    .data(park_poly.features)
    .join("path")
    .attr("fill", "#c4ed95")
    .attr("d", path)
}




d3.select("#legend")
  .node()
  .appendChild(
    Legend(
      d3.scaleOrdinal(
        ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
        ["#ffffff","#e1edf8","#cadef0","#abcfe6","#82badb","#59a1cf","#3787c0","#1c6aaf","#0b4d94","#08306b"]
      ),
      { title: "Percent Black (%)", width: 950, height:60 }
    ));

d3.select("#legend2")
  .node()
  .appendChild(
    Legend(
      d3.scaleOrdinal(
        ['Black Belt', 'N. Woodlawn', 'Hyde Park', 'S. Kenwood', 'N. Kenwood', 'South Shore', 'S. Woodlawn'],
        ["#1f77b4","#f52020", "#731603","#ff7f0e","#074228", "#4e2d6e","#e377c2"]
      ),
      {title: "Neighborhoods in Study Area", width: 950, height:60 }
    ));