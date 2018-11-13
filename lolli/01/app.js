d3.csv('fruit_sales.csv').then(fruitData => {
  // Circles.
  d3.select('svg')
    .selectAll('circle')
    .data(fruitData)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('cx', d => +d.Sales)
    .attr('cy', (d, i) => i * 40 + 40);

  // Text.
  d3.select('svg')
    .selectAll('text')
    .data(fruitData)
    .enter()
    .append('text')
    .attr('x', d => +d.Sales + 5)
    .attr('y', (d, i) => i * 40 + 40)
    .text(d => d.Fruit);

  // Lines.
  d3.select('svg')
    .selectAll('line')
    .data(fruitData)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', (d, i) => i * 40 + 40)
    .attr('x2', d => +d.Sales)
    .attr('y2', (d, i) => i * 40 + 40)
    .style('stroke-width', 2)
    .style('stroke', 'black');
});
