import * as d3 from 'd3';
import { transformData } from './helpers';

class BarChart {

  constructor(container, xAxisValues) {
    this.margin = {
      top: 20,
      bottom: 80,
      left: 60,
      right: 120
    };
    this.width = 800 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxisValues = xAxisValues;

    this.xscale = d3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1)
      .align(0.1);

    this.yscale = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    // http://tristen.ca/hcl-picker/#/hlc/10/1/B66063/E9DA5D
    this.colors = ["#B66063", "#BA6B87", "#AD7EA9","#9095C2","#66AACB","#41BDC3","#49CBAB","#77D58C","#AFDA6E","#E9DA5D"];
    this.colorScale = d3.scaleOrdinal()
      .range(this.colors);

    this.stack = d3.stack()
      .offset(d3.stackOffsetExpand);

    this.tooltip = this.svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    this.tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    this.tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
  }

  update(newData, filter, category, ) {
    const self = this;

    const data = transformData(newData, filter, category);

    this.xscale.domain(this.xAxisValues);
    this.colorScale.domain(data.options);

    const categories = this.g.selectAll('.category')
      .data(this.stack.keys(data.options)(data.data));

    const categoriesEntered = categories.enter()
      .append('g')
      .attr('class', 'category')
      .attr('fill', d => this.colorScale(d.key));

    const categoriesUpdated = categories.merge(categoriesEntered);

    categories.exit().remove();

    const rects = categoriesUpdated.selectAll('rect')
      .data( d => d );

    const rectsEntered = rects.enter()
      .append('rect')
      .on("mouseover", () => this.tooltip.style("display", null) )
      .on("mouseout", () => this.tooltip.style("display", "none") )
      // arrow function not possible because of "this"
      .on("mousemove", function(d) {
        let total = 0;
        for (const key in d.data) {
          if (d.data.hasOwnProperty(key) && key !== 'salary_midpoint' && key !== 'salary_range') {
            total += d.data[key];
          }
        }

        const n = Math.ceil((d[1] - d[0]) * total);

        const xPosition = d3.mouse(this)[0] - 15 + self.margin.left,
          yPosition = d3.mouse(this)[1] - 25 + self.margin.top;
        self.tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        self.tooltip.select("text").text(n + '(' + Math.round((d[1] - d[0]) * 100) + '%)');
      });

    const rectsUpdated = rects.merge(rectsEntered)
      .attr('x', d => this.xscale(d.data.salary_range))
      .attr('width', this.xscale.bandwidth())
      .transition()
      // .duration(1000)
      .attr('y', d => this.yscale(d[1]))
      .attr('height', d => this.yscale(d[0]) - this.yscale(d[1]));

    rects.exit().remove();

    // Axis
    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.xscale));

    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(this.yscale).ticks(10, "%"));

    // Legend
    const legend = this.svg.selectAll(".legend")
      .data(data.options);

    const legendEntered = legend.enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(" + this.margin.left + "," + ((i * 19) + this.margin.top) + ")" );

    legendEntered.append("rect");
    legendEntered.append("text");

    const legendUpdated = legend.merge(legendEntered);

    legendUpdated.select("rect")
      .attr("x", this.width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => this.colorScale(d));

    legendUpdated.select("text")
      .attr("x", this.width + 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d);

    legend.exit().remove();
  }
}

export default BarChart;

