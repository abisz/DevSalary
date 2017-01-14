export function transformData(data, filter, category) {
  const groupedData = {};
  let dataArray = [];

  const filteredData = filterData(data, filter);

  let options = [], keys = [];

  const salaryMap = new Map();

  filteredData.forEach( d => {
    if ( ! groupedData[d.salary_midpoint]) {
      groupedData[d.salary_midpoint] = {};
      salaryMap.set(d.salary_midpoint, d.salary_range)
    }
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
          {
            salary_midpoint: key,
            salary_range: salaryMap.get(key)
          },
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

export function transformDataByCategory(data, filter, category) {

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

export function allSalaries(data) {

  const midpoints = [];
  const salaries = [];

  data.forEach( d => {
    if (!midpoints.includes(d.salary_midpoint) && d.salary_midpoint) {
      midpoints.push(d.salary_midpoint);
      salaries.push({
        midpoint: d.salary_midpoint,
        range: d.salary_range
      });
    }
  });

  const sorted = salaries.sort( (a, b) => parseFloat(a.midpoint) - parseFloat(b.midpoint) );

  return sorted.map( e => e.range );
}

export function getCategories(data) {
  const categories = [];

  for (const category in data[0]) {
    if (category && data[0].hasOwnProperty(category)) {
      categories.push(category);
    }
  }

  return categories;
}