const DUMMY_DATA = [
    { id: 'd1', value: 10, region: 'USA' },
    { id: 'd2', value: 11, region: 'India' },
    { id: 'd3', value: 12, region: 'China' },
    { id: 'd4', value: 6, region: 'Germany' },
  ];

  console.log(DUMMY_DATA);

// d3.select('div')
//     .selectAll('p')
//     .data([1,2,3])
//     .enter() // as written, there are no p tags yet in the html doc
//     .append('p') // the enter and this append bring those elements into being
//     .text(data => data);

const container = d3.select('svg')
  .classed('container', true);

const bars = container
  .selectAll('.bar')
  .data(DUMMY_DATA)
  .enter()
  .append('svg') //applying bar to each data chunk appended to svg
  .classed('bar', true)
  .attr('width', 50)
  .attr('height', data => (data.value * 15))    //defining a function that gets called for each div