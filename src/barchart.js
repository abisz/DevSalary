const margin = {
    top: 20,
    bottom: 40,
    left: 40,
    right: 120
  },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

let data_g;

const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(d => "<strong>Frequency:</strong> <span style='color:red'>" + d + "</span>");

svg.call(tip);

const xscale = d3.scaleBand()
  .rangeRound([0, width])
  .padding(0.1)
  .align(0.1);

const yscale = d3.scaleLinear()
  .rangeRound([height, 0]);

const color = d3.scaleOrdinal()
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

const stack = d3.stack()
  .offset(d3.stackOffsetExpand);

d3.csv('./data/dataset_small.csv', (error, csv) => {

  if (error) {
    console.log(error);
  } else {
    data_g = csv;
    update(data_g);
  }

});

function update(newData) {

  console.log(newData[1]);

  const data = transformData(newData, {
    gender: {
      type: "not",
      value: "Female"
    }
  }, "age_range");

  xscale.domain(data.keys);
  color.domain(data.options);

  const serie = g.selectAll('.serie')
    .data(stack.keys(data.options)(data.data))
    .enter().append('g')
    .attr('class', 'serie')
    .attr('fill', d => color(d.key));

  serie.selectAll('rect')
    .data( d => d )
    .enter().append('rect')
    .attr('x', d => xscale(d.data.salary_midpoint))
    .attr('y', d => yscale(d[1]))
    .attr('height', d => yscale(d[0]) - yscale(d[1]))
    .attr('width', xscale.bandwidth())
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xscale));
  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yscale).ticks(10, "%"));

  var legend = serie.append("g")
    .attr("class", "legend")
    .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (xscale(d.data.salary_midpoint) + xscale.bandwidth()) + "," + ((yscale(d[0]) + yscale(d[1])) / 2) + ")"; });

  legend.append("line")
    .attr("x1", -6)
    .attr("x2", 6)
    .attr("stroke", "#000");

  legend.append("text")
    .attr("x", 9)
    .attr("dy", "0.35em")
    .attr("fill", "#000")
    .style("font", "10px sans-serif")
    .text(function(d) { return d.key; });

}

function transformData(data, filter, category) {
  const groupedData = {};
  let dataArray = [];

  const filteredData = data.filter( d => {

    for (const key in filter) {
      if (filter.hasOwnProperty(key)){

        if (filter[key].type === 'only') {
          if (d[key] !== filter[key].value) return false;
        } else if (filter[key].type === 'not') {
          if (d[key] === filter[key].value) return false;
        }
      }
    }

    return (d.salary_midpoint)
  });

  let options = [], keys = [];

  filteredData.forEach( d => {
    if ( ! groupedData[d.salary_midpoint]) groupedData[d.salary_midpoint] = {};
    if ( ! groupedData[d.salary_midpoint][d[category]]) groupedData[d.salary_midpoint][d[category]] = 0;
    if ( d[category] && ( ! options.includes(d[category]))) options.push(d[category]);
    groupedData[d.salary_midpoint][d[category]] += 1;
  });

  const optionsBoilerplate = {};

  options.forEach( o => optionsBoilerplate[o] = 0);

  for( const key in groupedData) {
    if (groupedData.hasOwnProperty(key)) {
      keys.push(key);

      dataArray.push(
        Object.assign(
          {salary_midpoint: key},
          optionsBoilerplate,
          groupedData[key]
        )
      );
    }
  }

  keys = keys.sort( (a, b) => parseInt(a) - parseInt(b));

  dataArray = dataArray.sort( (a, b) => parseInt(a.salary_midpoint) - parseInt(b.salary_midpoint) );

  return {
    data: dataArray,
    keys,
    options
  }
}