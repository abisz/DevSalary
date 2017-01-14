const filterList = d3.select('#filter')
  .append('ul');

const filterConfig = {
  gender: {
    type: "not",
    value: "Female"
  },
  age: {
    type: "only",
    value: "20-30"
  }
};

updateFilterList(filterConfig);

function updateFilterList(filterConfig) {
  
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

  const listItems = filterList.selectAll('li')
    .data(filters);

  const listItemsEntered = listItems.enter()
    .append('li')
    .attr('class', 'filter_item');

  listItemsEntered.append('p');

  listItemsEntered.append('button');

  const listItemsUpdated = listItems.merge(listItemsEntered);
  listItemsUpdated.select('p').text(d => (d.type === 'only' ? "✅ " : "🚫 ") + d.category + ': ' + d.value);
  listItemsUpdated.select('button').text("❌")
    .on('click', removedClicked)

  listItems.exit().remove();

}

function removedClicked(d) {
  delete filterConfig[d.category];
  updateFilterList(filterConfig);
}