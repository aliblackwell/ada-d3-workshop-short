// Main function.
function ready(uk, hairData) {
  const margin = { top: 40, right: 20, bottom: 20, left: 20 };
  const width = 750 - margin.left - margin.right;
  const height = 750 - margin.top - margin.bottom;

  // Set up SVG.
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  // Projection and path.
  const projection = d3
    .geoConicEqualArea()
    .parallels([49, 61])
    .fitSize([width, height], uk);
  const geoPath = d3.geoPath().projection(projection);

  // Draw geo.
  svg
    .append('path')
    .attr('d', geoPath(uk))
    .style('fill', 'fdfdfd')
    .style('stroke', '#ccc')
    .style('stroke-width', 1);

  // Draw circles.
  svg
    .selectAll('circle')
    .data(hairData.elements)
    .enter()
    .append('circle')
    .attr('cx', d => {
      return projection([d.lon, d.lat])[0];
    })
    .attr('cy', d => {
      return projection([d.lon, d.lat])[1];
    })
    .attr('r', 1)
    .style('fill', 'cornflowerblue')
    .style('fill-opacity', 0.5);
}

// Load data.
const geo = d3.json('./data/GBR_regions.json');
const data = d3.json('./data/hairdresser_point.json');

Promise.all([geo, data]).then(data => {
  const [uk, hairData] = data;
  ready(uk, hairData);
});
