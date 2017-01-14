function transformData(data, filter, category) {
  const groupedData = {};
  let dataArray = [];

  const filteredData = filterData(data, filter);

  let options = [], keys = [];

  filteredData.forEach( d => {
    if ( ! groupedData[d.salary_midpoint]) groupedData[d.salary_midpoint] = {};
    if ( ! groupedData[d.salary_midpoint][d[category]]) groupedData[d.salary_midpoint][d[category]] = 0;
    if ( d[category] && ( ! options.includes(d[category]))) options.push(d[category]);
    groupedData[d.salary_midpoint][d[category]] += 1;
  });

  const optionsBoilerplate = {};

  options.forEach( o => optionsBoilerplate[o] = 0);

  for( const key in groupedData) {
    if (groupedData.hasOwnProperty(key)) {
      keys.push(key);

      dataArray.push(
        Object.assign(
          {salary_midpoint: key},
          optionsBoilerplate,
          groupedData[key]
        )
      );
    }
  }

  keys = keys.sort( (a, b) => parseInt(a) - parseInt(b));

  dataArray = dataArray.sort( (a, b) => parseInt(a.salary_midpoint) - parseInt(b.salary_midpoint) );

  return {
    data: dataArray,
    keys,
    options
  }
}

function transformDataByCategory(data, filter, category) {

  const filteredData = filterData(data, filter);
  const groupedData = {};
  
  filteredData.forEach( d => {
    if ( ! groupedData[d[category]] ) groupedData[d[category]] = 0;
    groupedData[d[category]] += 1;
  });

  const dataArray = [];

  let total = 0;

  for (const key in groupedData) {
    if(groupedData.hasOwnProperty(key)) {
      dataArray.push({
        key,
        value: groupedData[key]
      });
      total += groupedData[key];
    }
  }

  return {
    category,
    total,
    data: dataArray
  }
}

function filterData(data, filter) {
  return data.filter( d => {

    for (const key in filter) {
      if (filter.hasOwnProperty(key)){

        if (filter[key].type === 'only') {
          if (d[key] !== filter[key].value) return false;
        } else if (filter[key].type === 'not') {
          if (d[key] === filter[key].value) return false;
        }
      }
    }

    return (d.salary_midpoint)
  });
}