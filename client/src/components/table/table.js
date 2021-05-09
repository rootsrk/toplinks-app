function Table(props) {
  const {
    tableData: { headers, data },
  } = props;
  return (
    <table className='home-content-stats-content-table'>
      <thead>
        <tr>
          {headers.map((item) => (
            <th key={item.label}>{item.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((domainData, index) => (
          <tr key={domainData.domain}>
            <td>{index + 1}</td>
            <td>{domainData.domain}</td>
            <td>{domainData.counter}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
