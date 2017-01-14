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

    listItemsEntered.append('p');

    listItemsEntered.append('button');

    const listItemsUpdated = listItems.merge(listItemsEntered);
    listItemsUpdated.select('p').text(d => (d.type === 'only' ? "✅ " : "🚫 ") + d.category + ': ' + d.value);
    listItemsUpdated.select('button').text("❌")
      .on('click', this.clicked);

    listItems.exit().remove();
  }
}

export default FilterList;
