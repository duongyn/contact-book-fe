import React from 'react';
import { Button } from 'antd';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import '../manage_asset/ManageSubject.css';
const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          'Category ',
          'Total',
          'Assigned',
          'Available',
          'Not available',
          'Waiting for recycling',
          'Recycled',
        ],
      ],
      { origin: 'A1' }
    );
    const wb = { Sheets: { asset: ws }, SheetNames: ['asset'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName);
  };

  return (
    <button
      type="button"
      className="create_button"
      onClick={e => exportToCSV(csvData, fileName)}
      style={{ marginBottom: 10, marginLeft: 920, paddingTop: 6 }}
    >
      Export
    </button>
  );
};
export default ExportCSV;
