// Main function.
function ready(uk, benchData) {
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

  // Set up colour scale.
  const colScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(benchData, d => d.perThousand)]);

  // Draw geo.
  svg
    .selectAll('path')
    .data(uk.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .style('fill', d => {
      return colScale(d.properties.info.perThousand);
    })
    .style('stroke', '#ccc')
    .style('stroke-width', 1);

  // Interaction.
  const mouseover = d => {
    // Get the value.
    const benchInfo = d.properties.info;

    d3.select('#tip')
      .html(
        `${benchInfo.region} has a population of ${benchInfo.population} and ${
          benchInfo.perThousand
        } benches per 1000 people.`
      )
      .style('top', `${d3.event.pageY}px`)
      .style('left', `${d3.event.pageX}px`)
      .transition()
      .style('opacity', 0.9);
  };

  const mousemove = d => {
    d3.select('#tip')
      .style('top', `${d3.event.pageY}px`)
      .style('left', `${d3.event.pageX}px`);
  };

  const mouseout = d => {
    d3.select('#tip')
      .transition()
      .style('opacity', 0);
  };

  d3.selectAll('path').on('mouseover', mouseover);
  d3.selectAll('path').on('mousemove', mousemove);
  d3.selectAll('path').on('mouseout', mouseout);
}

// Load data.
const type = d => ({
  region: d.region,
  bench: +d.bench,
  population: +d.population,
  perThousand: +d.perThousand,
});
const geo = d3.json('./data/GBR_regions.json');
const data = d3.csv('./data/bench.csv', type);

// Merge the geo data with the visual data.
const augmentGeoData = (geo, data) => {
  const updatedFeatures = geo.features.map(d => {
    const info = data.filter(el => el.region === d.properties.NAME_1)[0];
    const updatedProperties = Object.assign(d.properties, { info });

    delete d.properties;
    d.properties = updatedProperties;
    return d;
  });
  return {
    type: 'FeatureCollection',
    features: updatedFeatures,
  };
};

Promise.all([geo, data]).then(data => {
  const [uk, benchData] = data;

  const ukAugmented = augmentGeoData(uk, benchData);

  ready(ukAugmented, benchData);
});
