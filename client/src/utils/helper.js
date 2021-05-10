const sortObjectByKey = (firstObject, secondObject, key) =>
  firstObject[key] - secondObject[key];

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
