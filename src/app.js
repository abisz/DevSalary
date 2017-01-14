import * as d3 from 'd3';

import bubblechart from './bubblechart';
import BarChart from './BarChart';
import FilterList from './FilterList';
import CategorySlider from './CategorySlider';

import { allSalaries, getCategories } from './helpers';

let barchart, filterList, categorySlider;

let data, filter = {}, active = 'age_range', categories;

let toggle = true;
let salaries;

d3.csv('./data/dataset_small.csv', (error, csv) => {
  if (error) {
    console.log(error);
  } else {
    salaries = allSalaries(csv);
    categories = getCategories(csv);

    categorySlider = new CategorySlider('#slider', categories);
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
  barchart.update(data, filter, active);
  filterList.update(filter);
  categorySlider.update();
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
