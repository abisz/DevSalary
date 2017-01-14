const margin = {
    top: 20,
    bottom: 60,
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

// http://tristen.ca/hcl-picker/#/hlc/10/1/B66063/E9DA5D
const colors = ["#B66063", "#BA6B87", "#AD7EA9","#9095C2","#66AACB","#41BDC3","#49CBAB","#77D58C","#AFDA6E","#E9DA5D"];
const colorScale = d3.scaleOrdinal()
  .range(colors);

const stack = d3.stack()
  .offset(d3.stackOffsetExpand);

const tooltip = svg.append("g")
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
  colorScale.domain(data.options);

  const serie = g.selectAll('.serie')
    .data(stack.keys(data.options)(data.data))
    .enter().append('g')
    .attr('class', 'serie')
    .attr('fill', d => colorScale(d.key));

  serie.selectAll('rect')
    .data( d => d )
    .enter().append('rect')
    .attr('x', d => xscale(d.data.salary_midpoint))
    .attr('y', d => yscale(d[1]))
    .attr('height', d => yscale(d[0]) - yscale(d[1]))
    .attr('width', xscale.bandwidth())
    .on("mouseover", () => tooltip.style("display", null) )
    .on("mouseout", () => tooltip.style("display", "none") )
    // arrow function not possible because of "this"
    .on("mousemove", function(d) {
      let total = 0;
      for (const key in d.data) {
        if (d.data.hasOwnProperty(key) && key !== 'salary_midpoint') {
          total += d.data[key];
        }
      }
      
      const n = Math.ceil((d[1] - d[0]) * total);

      const xPosition = d3.mouse(this)[0] - 15 + margin.left,
        yPosition = d3.mouse(this)[1] - 25 + margin.top;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(n + '(' + Math.round((d[1] - d[0]) * 100) + '%)');
    });

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xscale));

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yscale).ticks(10, "%"));

  // Draw legend
  const legend = svg.selectAll(".legend")
    .data(data.options)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(" + margin.left + "," + ((i * 19) + margin.top) + ")" );

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    // .style("fill", function(d, i) {return colors.slice().reverse()[i];});
    .style("fill", (d, i) => colorScale(d));

  legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(d => d);

}
