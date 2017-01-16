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
    this.width = 1000 - this.margin.left - this.margin.right;
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
    
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory20c);

    this.stack = d3.stack()
      .offset(d3.stackOffsetExpand);

    this.tooltip = d3.select('body').append("div")
      .attr("class", "tooltipBar")
      .style("display", "none");

  }

  update(newData, filter, category) {
    const self = this;

    const data = transformData(newData, filter, category);

    this.xscale.domain(this.xAxisValues);
    this.colorScale.domain(data.options);

    const categories = this.g.selectAll('.category')
      .data(this.stack.keys(data.options)(data.data));

    const categoriesEntered = categories.enter()
      .append('g')
      .attr('class', 'category');

    const categoriesUpdated = categories.merge(categoriesEntered)
      .attr('fill', d => this.colorScale(d.key))
      .attr('data-option', d => d.key);

    categories.exit().remove();

    const rects = categoriesUpdated.selectAll('rect')
      .data( d => d );

    const rectsEntered = rects.enter()
      .append('rect')
      // arrow function not possible because of "this"
      .on("mouseover", function(e) {
        self.tooltip.style("display", null);
        // console.log(this);
        // this.style('fill', '#000');
      } )
      .on("mouseout", () => this.tooltip.style("display", "none") )
      .on("mousemove", function(d) {
        let total = 0;
        for (const key in d.data) {
          if (d.data.hasOwnProperty(key) && key !== 'salary_midpoint' && key !== 'salary_range') {
            total += d.data[key];
          }
        }

        // get value of hovered rect
        // kudos to http://bl.ocks.org/juan-cb/43f10523858abf6053ae
        const elements = document.querySelectorAll(':hover');
        const value = elements[elements.length - 2]
          .attributes
          .getNamedItem('data-option').value;

        const n = Math.ceil((d[1] - d[0]) * total);
        const perc = Math.round((d[1] - d[0]) * 100);

        self.tooltip.style("left", d3.event.pageX+15+"px");
        self.tooltip.style("top", d3.event.pageY-5+"px");

        self.tooltip.html(value + ' (' + perc + '%)');
      });

    const rectsUpdated = rects.merge(rectsEntered)
      .attr('x', d => this.xscale(d.data.salary_range))
      .attr('width', this.xscale.bandwidth())
      .transition()
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

