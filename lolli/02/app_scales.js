// How to get from lolli 01 to lolli 02:
// 1. Add x scale.
// 2. Add y scale.
// 3. Add colour.
// 4. Add transition.
// 5. Add delay.

d3.csv('fruit_sales_2020.csv').then(fruitData => {
  const fruitDataSorted = fruitData.slice().sort((a, b) => b.Sales - a.Sales);

  // 1. Define dimensions and variables.
  const margin = { top: 50, right: 50 };
  const width = 500 - margin.right;
  const height = 300 - margin.top;
  const extent = d3.extent(fruitDataSorted, d => +d.Sales);
  const dur = 1000;

  // 2. Define the scales.
  const xScale = d3
    .scaleLinear()
    .domain([0, extent[1]])
    .range([0, width]);

  const yScale = d3
    .scaleBand()
    .domain(fruitDataSorted.map(d => d.Fruit))
    .range([margin.top, height + margin.top]);

  const colScale = d3
    .scaleSequential(d3.interpolateRdPu)
    .domain([0, extent[1]]);

  // 3. Build the visual.

  // Circles.
  d3.select('svg')
    .selectAll('circle')
    .data(fruitDataSorted)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('fill', d => colScale(+d.Sales))
    .attr('cy', d => yScale(d.Fruit))
    .transition()
    .duration(dur)
    .delay((d, i) => i * 250)
    .attr('cx', d => xScale(+d.Sales));

  // Text.
  d3.select('svg')
    .selectAll('text')
    .data(fruitDataSorted)
    .enter()
    .append('text')
    .text(d => d.Fruit)
    .attr('y', d => yScale(d.Fruit))
    .transition()
    .duration(dur)
    .delay((d, i) => i * 250)
    .attr('x', d => xScale(+d.Sales) + 5);

  // Lines.
  d3.select('svg')
    .selectAll('line')
    .data(fruitDataSorted)
    .enter()
    .append('line')
    .style('stroke-width', 2)
    .style('stroke', d => colScale(+d.Sales))
    .attr('y1', d => yScale(d.Fruit))
    .attr('y2', d => yScale(d.Fruit))
    .transition()
    .duration(dur)
    .delay((d, i) => i * 250)
    .attr('x1', 0)
    .attr('x2', d => xScale(+d.Sales));
});
