import { useState } from "react";

import './css/App.css';
import places from './data.js';
import Table from './components/Table';
import Chart from './components/Chart';

function App() {
    const [filteredData, setFilteredData] = useState(places);

    return (
        <div className="App">
            <h3>Достопримечательности Владивостока</h3>
            <Chart data={filteredData} />
            <Table
                data={places}
                amountRows={15}
                isPagination={true}
                onFilteredDataChange={setFilteredData}
            />
        </div>
    );
}

export default App;
