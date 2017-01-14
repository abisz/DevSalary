import * as d3 from 'd3';
import BarChart from './BarChart';
import { allSalaries } from './helpers';

let barchart;

let data;

let toggle = true;
let salaries;

d3.csv('./data/dataset_small.csv', (error, csv) => {
  if (error) {
    console.log(error);
  } else {
    salaries = allSalaries(csv);

    barchart = new BarChart('#barchart', salaries);

    data = csv;
    barchart.update(csv, {}, "age_range");
  }
});

document.getElementById('btn-change').addEventListener('click', (e) => {
  if (toggle) {
    barchart.update(data, {}, 'age_range');
  } else {
    barchart.update(data, {
      gender: {
        type: 'only',
        value: 'Female'
      }
    }, 'age_range');
  }

  toggle = !toggle;
});
