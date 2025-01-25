export function handleCheck(id, selectedRows, setSelectedRows) {
  if (selectedRows.includes(id)) {
    setSelectedRows((prevRows) => prevRows.filter((item) => item !== id));
  } else {
    setSelectedRows((prevRows) => [...prevRows, id]);
  }
}

export function handleCheckAll(tableData, selectedRows, setSelectedRows) {
  if (selectedRows.length === tableData.length) {
    setSelectedRows([]);
  } else {
    setSelectedRows(tableData.map((entry) => entry.id));
  }
}
