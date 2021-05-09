function Table(props) {
  const {
    tableData: { headers, data },
  } = props;
  return (
    <table className='home-content-stats-content-table'>
      <tr>
        {headers.map((item) => (
          <th>{item.label}</th>
        ))}
      </tr>
      {data.map((domainData, index) => (
        <tr>
          <td>{index + 1}</td>
          <td>{domainData.domain}</td>
          <td>{domainData.counter}</td>
        </tr>
      ))}
    </table>
  );
}

export default Table;
