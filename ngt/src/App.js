import './App.css';
import { Table } from './Table';
import {ToastContainer} from 'react-toastify'

function App() {
  return (
    <div className="App">
      <div className='text-center bg-dark '>
        <h3 className='my-3 text-white p-2'>Forcasting Application</h3>
      </div>
      <Table/>
      <ToastContainer/>
    </div>
  );
}

export default App;
