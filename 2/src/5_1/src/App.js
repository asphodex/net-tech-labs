import { useState } from "react";

import './css/App.css';
import buildings from './data.js';
import Table from './components/Table';
import Chart from './components/Chart';

function App() {
    const [filteredData, setFilteredData] = useState(buildings);

    return (
        <div className="App">
            <h3>Самые высокие здания и сооружения</h3>
            <Chart data={filteredData} />
            <Table
                data={buildings}
                amountRows={15}
                isPagination={true}
                onFilteredDataChange={setFilteredData}
            />
        </div>
    );
}

export default App;
