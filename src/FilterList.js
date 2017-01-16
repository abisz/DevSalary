import * as d3 from 'd3';

class FilterList {
  constructor(container, clicked) {
    this.list = d3.select(container)
      .append('ul');

    this.clicked = clicked;
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
      .on('click', e => console.log(e));

    listItemsUpdated.select('p').text(d => d.category + ': ' + d.value);
    listItemsUpdated.select('button').text("❌")
      .attr('class', 'remove-btn')
      .on('click', this.clicked);

    listItems.exit().remove();
  }
}

export default FilterList;
