const nestedSort = (sortKey, direction = 'asc') => (e1, e2) => {
  const a = e1[sortKey],
    b = e2[sortKey],
    sortOrder = direction === 'asc' ? 1 : -1;
  return a < b ? -sortOrder : a > b ? sortOrder : 0;
};

const sortObjectByKey = (input, key, order = 'desc') => {
  const s = Object.entries(input).sort(nestedSort(key, order));
  return s;
};

const constants = {
  tableData: {
    headers: [
      {
        id: 'rank',
        label: 'Rank',
      },
      {
        id: 'domain',
        label: 'Domain',
      },
      {
        id: 'hits',
        label: 'Hits',
      },
    ],
    data: [],
  },
};

export { sortObjectByKey, constants };
