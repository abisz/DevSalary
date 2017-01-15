import * as d3 from 'd3';

import BubbleChart from './BubbleChart';
import BarChart from './BarChart';
import FilterList from './FilterList';
import CategorySlider from './CategorySlider';

import { allSalaries, getCategories } from './helpers';

let barchart, bubblechart, filterList, categorySlider;

let data, filter = {}, categories,  activeBarchart = 'age_range', activeBubblechart = 'age_range';

let toggle = false;
let salaries;

d3.csv('./data/dataset_small.csv', (error, csv) => {
  if (error) {
    console.log(error);
  } else {
    salaries = allSalaries(csv);
    categories = getCategories(csv);

    categorySlider = new CategorySlider('#slider', categories, category => {
      console.log(category);

      activeBarchart = category;
      update();
    });
    barchart = new BarChart('#barchart', salaries);
    bubblechart = new BubbleChart('#bubblechart');
    filterList = new FilterList('#filter', d => {
      delete filter[d.category];
      update();
    });

    data = csv;
    update();
  }
});

function update() {
  barchart.update(data, filter, activeBarchart);
  bubblechart.update(data, filter, activeBubblechart);
  filterList.update(filter);
  categorySlider.update(activeBarchart);
}

document.getElementById('btn-change').addEventListener('click', (e) => {
  if (toggle) {
    category = "age_range";
  } else {
    category = "gender";
  }
  toggle = !toggle;

  update();
});
