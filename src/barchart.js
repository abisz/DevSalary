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

var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

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
    .on("mouseover", () => tooltip.style("display", null) )
    .on("mouseout", () => tooltip.style("display", "none") )
    .on("mousemove", d => {
      const xPosition = d3.mouse(this)[0] - 15,
        yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xscale));
  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yscale).ticks(10, "%"));

  const legend = serie.append("g")
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