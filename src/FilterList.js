import * as d3 from 'd3';
import data_config from '../data/data_config.json';

class FilterList {
  constructor(container, remove, toggle) {
    this.list = d3.select(container)
      .append('ul');

    this.remove = remove;
    this.toggle = toggle;
  }

  update(filterConfig) {
    const filters = [];

    for (const category in filterConfig) {
      if (filterConfig.hasOwnProperty(category)) {
        filters.push({
          category,
          type: filterConfig[category].type,
          value: filterConfig[category].value
        });
      }
    }

    const listItems = this.list.selectAll('li')
      .data(filters);

    const listItemsEntered = listItems.enter()
      .append('li')
      .attr('class', 'filter_item');

    listItemsEntered.append('span');

    listItemsEntered.append('p');

    listItemsEntered.append('button');

    const listItemsUpdated = listItems.merge(listItemsEntered);
    listItemsUpdated.select('span')
      .text(d => d.type === 'only' ? "✅ " : "🚫 ")
      .on('click', this.toggle);

    listItemsUpdated.select('p').text(d => data_config[d.category] + ': ' + d.value);
    listItemsUpdated.select('button').text("❌")
      .attr('class', 'remove-btn')
      .on('click', this.remove);

    listItems.exit().remove();
  }
}

export default FilterList;
