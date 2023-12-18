import React,{ useState } from 'react'
import {AgGridReact} from 'ag-grid-react'
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

export const Table =()=>{

    const [gridApi, setGridApi] = useState(null);
    const [colDefs, setColumns] = useState([]);
    const [rowData, setRowData] = useState([]);
     

    const addColumn = () => {
        const newColumnName = prompt('Enter column name:');
        if (newColumnName) {
          const newColumn = { headerName: newColumnName, field: newColumnName.toLowerCase() };
          setColumns([...colDefs, newColumn]);
        }
      };
    
      const addRow = () => {
        const newRow = {};
        colDefs.forEach((column) => {
          newRow[column.field] = '';
        });
        setRowData([...rowData, newRow]);
      };
    
    // const rowData = [
    //     {Name:"Amit Sharma", Age:21},
    //     {Name:"Devansh Marwaha", Age:22}
    // ]

    // const colDefs =[
    //     {
    //         field:'Name'
    //     },
    //     {
    //         field:'Age'
    //     }
    // ]

    //Default behaviour of the columns      
    const DefaultColumnDefination = {
        editable:true,
        filter:true,
        floatingFilter:true,
        flex:1
    }


    //To Download file in CSV mode following two function are required

    const onGridReady = (params) => {
        setGridApi(params.api);
      };

    const ExportData = ()=>{
        gridApi.exportDataAsCsv();
    }



    return(

        <div className='ms-5'>

        <button className='btn btn-primary' onClick={()=>ExportData()} style={{marginBottom:2}} >
              Export
        </button>

        <button className='btn btn-outline-success ms-2' onClick={addColumn}>Add Column</button>
        <button className='btn btn-outline-danger ms-2' onClick={addRow}>Add Row</button>

        <div className="ag-theme-quartz" style={{ height: 500, width: '90vw'}}>
            <AgGridReact
             rowData={rowData} 
             columnDefs={colDefs}
             defaultColDef={DefaultColumnDefination}
             onGridReady={onGridReady} />
        </div>
        </div>
    )
        
    
}