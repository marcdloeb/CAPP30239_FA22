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
  d3.csv("data/unemployment2020.csv"),
  d3.json("libs/counties-albers-10m.json")
]).then(([data, us]) => {
  const dataById = {};

  for (let d of data) {
    d.rate = +d.rate; //coercing the data format
    //making a lookup table from the array (unemployment data)
    dataById[d.id] = d;
  }

  console.log(dataById)

  const counties = topojson.feature(us, us.objects.counties);

  //Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize()
    .domain([0, 10]).nice()
    .range(d3.schemeBlues[9]);

  const path = d3.geoPath();

  d3.select("#legend")//building out the legend, being placed by the HTML
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ["1", "2", "3", "4", "5", "6", "7", "8", "9+"], //these don't have to be numbers, could set to string, categories wouldn't change
          d3.schemeBlues[9] //number of colors
        ),
        { title: "Unemployment rate (%)" }
      ));

  svg.append("g") //tool tips
    .selectAll("path")
    .data(counties.features)
    .join("path")
    .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc')
    .attr("d", path)
    .on("mousemove", function (event, d) {
      let info = dataById[d.id];
      tooltip
        .style("visibility", "visible")
        .html(`${info.county}<br>${info.rate}%`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "goldenrod");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc');
    });
});


// const tooltip = d3.select("body")
//   .append("div")
//   .attr("class", "svg-tooltip")
//   .style("position", "absolute")
//   .style("visibility", "hidden");

// const height = 610,
//   width = 975;

// const svg = d3.select("#chart")
//   .append("svg")
//   .attr("viewBox", [0, 0, width, height]);

// 
// Promise.all([
//   d3.csv("unemployment2020.csv"),
//   d3.json("counties-albers-10m.json") //topojson!
// ]).then(([data, us]) => { //"data comes from the csv, us comes from the topojson"
//   const dataById = {};

//   for (let d of data) {
//     d.rate = +d.rate; 
//     //making a lookup table from the array (unemployment data)
//     dataById[d.id] = d;
//   }

//   

//   const tooltip = d3.select("body").append("div")
//     .attr("class", "svg-tooltip")
//     .style("position", "absolute")
//     .style("visibility", "hidden");

//   const counties = topojson.feature(us, us.objects.counties);

//   // Quantize evenly breakups domain into range buckets
//   const color = d3.scaleQuantize()  //breaks up dominate into buckets
//     .domain([0, 10]).nice() //breaking up into 1% buckets
//     .range(d3.schemeBlues[9]);
//     console.log(d3.extent(data, d => d.rate))

//   // Average umemployment rate is now 3.7%,
//   // knowing this we can build a diverging scale.
//   // 3.7% will be middle, low high on either side

//   const path = d3.geoPath();  //creating a path

//   d3.select("#legend")
//     .node()
//     .appendChild(
//         Legend(
//           d3.scaleOrdinal(
//             ["1", "2", "3", "4", "5", "6", "7", "8", "9+"], 
//             d3.schemeBlues[9]
//           ), 
//         {title: "Unemployment rate (%)"}
//       ));

//   const svg = d3.select("#chart")
//     .append("svg")
//     .attr("viewBox", [0, 0, width, height]);

//   svg.append("g")
//     .selectAll("path")
//     .data(counties.features)
//     .join("path")
//     .attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc')
//     .attr("d", path)
//     .on("mousemove", function (event, d) {
//       let info = dataById[d.id];
//       tooltip
//         .style("visibility", "visible")
//         .html(`${info.county}<br>${info.rate}%`)
//         .style("top", (event.pageY - 10) + "px")
//         .style("left", (event.pageX + 10) + "px");
//       d3.select(this).attr("fill", "goldenrod");
//     })
//     .on("mouseout", function () {
//       tooltip.style("visibility", "hidden");
//       d3.select(this).attr("fill", d => (d.id in dataById) ? color(dataById[d.id].rate) : '#ccc');
//     });
// });