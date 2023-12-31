import React, { useState, useEffect } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const onGridReady = (params) => {
  setGridApi(params.api);
};

//Clear localstorage
const clearAll=()=>{
  localStorage.removeItem('tableData');
  window.location.reload();
}

//To add Column in the grid
const addColumn = () => {
    const newColumnName = prompt('Enter column name:');
    if (newColumnName) {
      const newColumn = { headerName: newColumnName, field: newColumnName.toLowerCase() };
      setColumnDefs([...columnDefs, newColumn]);
      // Save data to localStorage when columns are added
      saveDataToLocalStorage({ columnDefs: [...columnDefs, newColumn], rowData });
      notify('Column Element Added Successfully');
    }
  };

//To change / update a rows value
const onCellValueChanged = (event) => {
    const updatedRowData = rowData.map((row) => (row.id === event.data.id ? event.data : row));
    setRowData(updatedRowData);
    // Save data to localStorage when cell value changes
    saveDataToLocalStorage({ columnDefs, rowData: updatedRowData });

    notify('Row Element Added Successfully');
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

  //Function to save data to localStorage
  const saveDataToLocalStorage = (data) => {
    localStorage.setItem('tableData', JSON.stringify(data));
  };

  //For sum
  const calculateColumnSum = () => {
    const columnName = prompt('Enter column name:')?.toLowerCase();
    if(columnName){
      const columnValues = rowData.map((row) => parseFloat(row[columnName]) || 0);
      const sum = columnValues.reduce((acc, value) => acc + value, 0);
      alert(`Total sum for column ${columnName} is ${sum}`);
    }
    
  };

  //For ratio based ops
  const calculateValuesBasedOnRatios = () => {
    if (!gridApi) {
      console.error('Grid API is not available');
      return;
    }
  
    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      notify('Please select rows to calculate ratio.');
      return;
    }
  
    const sourceColumn = prompt('Enter source column name:')?.toLowerCase();
    let targetColumn;
    let totalSumOfTarget;
    if (sourceColumn) {
      targetColumn = prompt('Enter target column name:')?.toLowerCase();
      if (targetColumn) {
        totalSumOfTarget = prompt('Enter total sum of target columns values');
      }
    }
  
    if (sourceColumn && targetColumn) {
      const updatedRowData = [...rowData];
  
      selectedNodes.forEach((node) => {
        const sourceValue = parseFloat(node.data[sourceColumn]);
  
        if (!isNaN(sourceValue) && isFinite(sourceValue)) {
          const totalSource = selectedNodes.reduce((total, row) => {
            const value = parseFloat(row.data[sourceColumn]);
            return !isNaN(value) && isFinite(value) ? total + value : total;
          }, 0);
  
          const ratio = totalSource !== 0 ? sourceValue / totalSource : 0;
          const valueTarget = ratio * totalSumOfTarget;
  
          if (!isNaN(valueTarget) && isFinite(valueTarget)) {
            // Find the index of the node in the original rowData
            const index = updatedRowData.findIndex((row) => row.id === node.data.id);
  
            if (index !== -1) {
              // Update the target column value in the original rowData
              updatedRowData[index] = { ...node.data, [targetColumn]: String(valueTarget) };
            }
          }
        }
      });
  
      setRowData(updatedRowData);
      saveDataToLocalStorage({ columnDefs, rowData: updatedRowData });
    }
  };  
  
  
  // To calculate sum for sub rows
  const calculateSumForSubRows = () => {

    if (!gridApi) {
      console.error('Grid API is not available');
      return;
    }

    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      notify('Please select rows to calculate sum.');
      return;
    }

    const targetColumnName = prompt('Enter target column name for sum:');
    if (!targetColumnName) return;

    const selectedRows = selectedNodes.map((node) => node.data);
    console.log(selectedRows)

    const sum = selectedRows.reduce((acc, row) => acc + parseFloat(row[targetColumnName] || 0), 0);

    alert(`Sum of ${targetColumnName} for Selected rows : ${Math.floor(sum)}`);
  };



  //Function to delete the selected rows (Use ^ctrl in order to select multiple rows and ^shift in order to select upto a particular row)
  const deleteRows = () => {
    if (!gridApi) {
      console.error('Grid API is not available');
      return;
    }

    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length === 0) {
      notify('Please select rows to delete.');
      return;
    }

    const selectedRowIds = selectedNodes.map((node) => node.data.id);
    const updatedRowData = rowData.filter((row) => !selectedRowIds.includes(row.id));

    setRowData(updatedRowData);
    saveDataToLocalStorage({ columnDefs, rowData: updatedRowData });
    notify('Selected Rows Deleted Successfully');

    // Clear the selected rows after deletion
    gridApi.deselectAll();
  };


  //For Toast Messages
  const notify = (param) => toast(param);

  //Function used to export the data in csv format
  const exportData = () => {
    if (gridApi && rowData.length > 0) {
      gridApi.exportDataAsCsv();
    } else {
      alert('No data to export.');
    }
  };

  return (
    <div className='ms-5'>
      <button className='btn btn-primary' onClick={() => exportData()} style={{ marginBottom: 2 }}>
        Export
      </button>
      <button className='btn btn-danger ms-2' onClick={clearAll} style={{ marginBottom: 2 }}>
        Clear All
      </button>
      <button className="btn btn-warning ms-2" onClick={(deleteRows)} style={{ marginBottom: 2 }}>
        Delete Selected Rows
      </button>
      <button className='btn btn-outline-dark ms-2' onClick={addColumn} style={{ marginBottom: 2 }}>
        Add Column
      </button>
      <button className='btn btn-outline-dark ms-2' onClick={addRow} style={{ marginBottom: 2 }}>
        Add Row
      </button>
      <span style={{marginLeft:10,marginBottom:2,fontWeight:500}}>Functions:</span>
      <button className='btn btn-outline-info ms-2' onClick={() => calculateColumnSum()} style={{ marginBottom: 2 }}>
        Calculate Sum
      </button>
      <button className='btn btn-outline-info ms-2' onClick={calculateSumForSubRows}>
        Sum Sub Rows
      </button>
      <button className='btn btn-outline-info ms-2' onClick={calculateValuesBasedOnRatios} style={{ marginBottom: 2 }}>
        Calculate Ratios
      </button>
      <div className='ag-theme-quartz mt-2 mb-3' style={{ height: 500, width: '90vw' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ editable: true, filter: true, floatingFilter: true, flex: 1 }}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          rowSelection="multiple"
        />
      </div>
    </div>
  );
};
