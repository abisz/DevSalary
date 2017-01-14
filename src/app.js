import * as d3 from 'd3';
import BarChart from './BarChart';

d3.csv('./data/dataset_small.csv', (error, data) => {

  if (error) {
    console.log(error);
  } else {
    const barchart = new BarChart('#barchart');
    barchart.update(data);
  }

});


