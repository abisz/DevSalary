import * as d3 from 'd3';
import { transformDataByCategory } from './helpers';

const diameter = 600,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeCategory20c);

const bubble = d3.pack()
    .size([diameter, diameter])
    .padding(1.5);

const svg = d3.select("#bubblechart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

let data_g;

d3.csv('./data/dataset_small.csv', (error, csv) => {
    if (error) {
        console.log(error);
    } else {
        data_g = csv;
        update(data_g);
    }
});

function update(newData) {

    const data = transformDataByCategory(newData,
        {},
        "age_range");

    console.log(data);

    let root = d3.hierarchy(classes(data.data))
        .sum(function(d) { return d.value; });

    bubble(root);
    let node = svg.selectAll(".node")
        .data(root.children)
    .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.data.className + ": " + format(d.value); });

    node.append("circle")
        .transition().attr("r", function(d) { return ((d.r / data.total)* 500); })
        .style("fill", function(d) {
            return color(d.data.packageName);
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.className.substring(0, d.r / 3); });

}

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

d3.select(self.frameElement).style("height", diameter + "px");