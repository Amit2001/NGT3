import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export const Table = () => {
  const [gridApi, setGridApi] = useState(null);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    // Load data from localStorage when the component mounts
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      const { columnDefs: savedColumnDefs, rowData: savedRowData } = JSON.parse(savedData);
      setColumnDefs(savedColumnDefs);
      setRowData(savedRowData);
    }
  }, []);

  useEffect(() => {
    if (gridApi) {
      // Do any setup or initialization with the gridApi here
    }
  }, [gridApi]);

  const addColumn = () => {
    const newColumnName = prompt('Enter column name:');
    if (newColumnName) {
      const newColumn = { headerName: newColumnName, field: newColumnName.toLowerCase() };
      setColumnDefs([...columnDefs, newColumn]);
      // Save data to localStorage when columns are added
      saveDataToLocalStorage({ columnDefs: [...columnDefs, newColumn], rowData });
    }
  };

  const onCellValueChanged = (event) => {
    const updatedRowData = rowData.map((row) => (row.id === event.data.id ? event.data : row));
    setRowData(updatedRowData);
    // Save data to localStorage when cell value changes
    saveDataToLocalStorage({ columnDefs, rowData: updatedRowData });
  };

  const addRow = () => {
    const newRow = { id: Date.now() }; // Assign a unique ID to the new row
    columnDefs.forEach((column) => {
      newRow[column.field] = '';
    });
    setRowData([...rowData, newRow]);
    // Save data to localStorage when rows are added
    saveDataToLocalStorage({ columnDefs, rowData: [...rowData, newRow] });
  };

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem('tableData', JSON.stringify(data));
  };

  const calculateColumnSum = () => {
    const columnName = prompt('Enter column name:');
    const columnValues = rowData.map((row) => parseFloat(row[columnName]) || 0);
    const sum = columnValues.reduce((acc, value) => acc + value, 0);
    return sum;
  };

  const exportData = () => {
    if (gridApi && rowData.length > 0) {
      gridApi.exportDataAsCsv();
    } else {
      alert('No data to export.');
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div className='ms-5'>
      <button className='btn btn-primary' onClick={() => exportData()} style={{ marginBottom: 2 }}>
        Export
      </button>
      <button className='btn btn-outline-success ms-2' onClick={addColumn}>
        Add Column
      </button>
      <button className='btn btn-outline-danger ms-2' onClick={addRow}>
        Add Row
      </button>
      <button
        className='btn btn-outline-info ms-2'
        onClick={() => alert(`Sum: ${calculateColumnSum()}`)}
      >
        Calculate Sum
      </button>
      <div className='ag-theme-quartz' style={{ height: 500, width: '90vw' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ editable: true, filter: true, floatingFilter: true, flex: 1 }}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
};
