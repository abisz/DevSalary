import * as d3 from 'd3';
import BubbleChart from './BubbleChart';
import BarChart from './BarChart';
import FilterList from './FilterList';

import { allSalaries } from './helpers';

let barchart, filterList;

let data, filter = {}, category = 'age_range';

let toggle = true;
let salaries;

d3.csv('./data/dataset_small.csv', (error, csv) => {
  if (error) {
    console.log(error);
  } else {
    salaries = allSalaries(csv);

    barchart = new BarChart('#barchart', salaries);
    filterList = new FilterList('#filter', d => {
      delete filter[d.category];
      update();
    });

    data = csv;
    update();
  }
});

function update() {
  barchart.update(data, filter, category);
  filterList.update(filter);
}

document.getElementById('btn-change').addEventListener('click', (e) => {
  if (toggle) {
    filter = {};
  } else {
    filter = {
      gender: {
        type: 'only',
        value: 'Female'
      }
    };
  }
  toggle = !toggle;

  update();
});
