import * as d3 from 'd3';
import {transformDataByCategory} from './helpers';

class BubbleChart {

    constructor(container, clickEvent) {

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

        this.clickEvent = clickEvent;
    }

    update(newData, filter, category) {
        const self = this;

        const data = transformDataByCategory(newData, {}, category);

        let root = d3.hierarchy(classes(data.data))
            .sum(function (d) {
                return d.value;
            });

        this.bubble(root);
        let node = this.svg.selectAll(".node")
            .data(root.children);


        const nodeEntered = node.enter()
            .append("g")
            .attr("class", "node");

        nodeEntered.append("title");
        nodeEntered.append("circle");
        nodeEntered.append("text");

        const nodeUpdated = node.merge(nodeEntered)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr('class', function (d) {
                if (filter.hasOwnProperty(category)) {
                    if (filter[category].value != d.data.packageName) {
                        return 'node inactive'
                    }
                }
                return 'node'
            },)
            .on("click", this.clickEvent);

        nodeUpdated.select('title')
            .text(function (d) {
                return d.data.className + ": " + self.format(d.value);
            });

        nodeUpdated.select("circle")
            .transition().attr("r", d => d.r )
            .style("fill", function(d) {
                return self.color(d.data.packageName);
            });


        nodeUpdated.select("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.data.className.substring(0, d.r / 3);
            });

        node.exit().remove();
    }
}

export default BubbleChart;

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
    let classes = [];

    for (let node of root) {
        if (node.key) {
            classes.push({packageName: node.key, className: node.key, value: node.value});
        }
    }
    return {children: classes};
}


