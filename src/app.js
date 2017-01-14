import * as d3 from 'd3';
import BarChart from './BarChart';

const barchart = new BarChart('#barchart');

let data;

d3.csv('./data/dataset_small.csv', (error, csv) => {
  if (error) {
    console.log(error);
  } else {
    data = csv;
    barchart.update(csv, {}, "gender");
  }
});

document.getElementById('btn-change').addEventListener('click', (e) => {
  barchart.update(data, {}, 'age_range');
});
