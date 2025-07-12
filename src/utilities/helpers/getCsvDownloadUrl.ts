export const getCsvDownloadUrl = (header: string[], rows: (string | number)[][]) => {
  let data = header ? header.join(",") + "\n" : "";
  const tableData = [];

  for (const row of rows) {
    const rowData = [];
    for (const column of row) {
      rowData.push(column);
    }
    tableData.push(rowData.join(","));
  }

  data += tableData.join("\n");

  const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));

  return url;
};
