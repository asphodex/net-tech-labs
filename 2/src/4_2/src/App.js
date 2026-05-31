import './css/App.css';
import places from './data.js';
import Table from './components/Table';

function App() {
  return (
    <div className="App">
      <h3>Достопримечательности Владивостока</h3>
      <Table data={places} amountRows={10} isPagination={true} />
    </div>
  );
}

export default App;
