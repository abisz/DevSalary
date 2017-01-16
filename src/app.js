import * as d3 from 'd3';

import BubbleChart from './BubbleChart';
import BarChart from './BarChart';
import FilterList from './FilterList';
import CategorySlider from './CategorySlider';

import { allSalaries, getCategories } from './helpers';

let barchart, bubblechart, filterList, categorySliderBar, categorySliderBubble;

let data,
  filter = {},
  categories,
  activeBarchart = 'gender',
  activeBubblechart = 'age_range';

let salaries;

const DATA_URL = './data/dataset_full.csv';

importData(DATA_URL);

function importData(url, secondTry=false) {
  d3.csv(url, (error, csv) => {
    if (error) {
      // in case someone doesn't have the complete dataset,
      // which is not checked into git due to its size
      if ( ! secondTry) {
        console.info('Dataset not found - smaller alternative is loaded...');
        importData('./data/dataset_small.csv', true);
      } else {
        console.log(error);
      }

    } else {
      salaries = allSalaries(csv);
      categories = getCategories(csv);

      categorySliderBar = new CategorySlider('#sliderBar', categories, category => {
        activeBarchart = category;
        update();
      });
      categorySliderBubble = new CategorySlider('#sliderBubble', categories, category => {
        activeBubblechart = category;
        update();
      });
      barchart = new BarChart('#barchart', salaries);
      bubblechart = new BubbleChart('#bubblechart', d => {
        if (
          filter[activeBubblechart] &&
          filter[activeBubblechart].value === d.data.packageName
        ) delete filter[activeBubblechart];
        else filter[activeBubblechart] = {type: "only", value: d.data.packageName};
        update();
      });
      filterList = new FilterList('#filter', d => {
        delete filter[d.category];
        update();
      }, d => {
        filter[d.category].type = d.type === 'only' ? 'not' : 'only';
        update();
      });

      data = csv;
      update();
    }
  });
}


function update() {
  barchart.update(data, filter, activeBarchart);
  bubblechart.update(data, filter, activeBubblechart);
  filterList.update(filter);
  categorySliderBar.update(activeBarchart);
  categorySliderBubble.update(activeBubblechart);
}
