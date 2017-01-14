import * as d3 from 'd3';
import { transformDataByCategory } from './helpers';

class BubbleChart {

    constructor(container) {

        this.diameter = 600,
            this.format = d3.format(",d"),
            this.color = d3.scaleOrdinal(d3.schemeCategory20c);

        this.bubble = d3.pack()
            .size([this.diameter, this.diameter])
            .padding(1.5);

        this.svg = d3.select(container).append("svg")
            .attr("width", this.diameter)
            .attr("height", this.diameter)
            .attr("class", "bubble");
    }

    update(newData, filter, category){
        const self = this;

        const data = transformDataByCategory(newData, filter, category);

        let root = d3.hierarchy(classes(data.data))
            .sum(function(d) { return d.value; });

        this.bubble(root);
        let node = this.svg.selectAll(".node")
            .data(root.children)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.data.className + ": " + self.format(d.value); });

        node.append("circle")
            .transition().attr("r", function(d) { return ((d.r / data.total)* 500); })
            .style("fill", function(d) {
                return self.color(d.data.packageName);
            });

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.className.substring(0, d.r / 3); });

    }
}

export default BubbleChart;

// Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        let classes = [];

        for (let node of root){
            if(node.key) {
                classes.push({packageName: node.key, className: node.key, value: node.value});
            }
        }
        return {children: classes};
    }


