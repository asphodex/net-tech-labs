import { useState } from "react";

import '../css/App.css';
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import Sort from './Sort.js';

const Table = (props) => {
    const [dataTable, setDataTable] = useState(props.data);

    const n = Math.max(1, Math.ceil(dataTable.length / props.amountRows));
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const [activePage, setActivePage] = useState("1");
    const changeActive = (event) => {
        setActivePage(event.target.innerHTML);
    };

    const [mode, setMode] = useState("reset");

    const updateDataTable = (value) => {
        setDataTable(value);
        setActivePage("1");
        setMode(value === props.data ? "reset" : "applied");
    };

    const applySort = (value) => {
        setDataTable(value);
        setActivePage("1");
        setMode(value === props.data ? "reset" : "applied");
    };

    const pages = arr.map((item, index) =>
        <span key={index} onClick={changeActive}
              className={activePage === `${index + 1}`
                  ? "pageNum pageNum-current"
                  : "pageNum"}
        >
            {item}
        </span>
    );

    const fields = Object.keys(props.data[0]);

    return (
        <>
            <h4>Фильтры</h4>
            <Filter
                filtering={updateDataTable}
                fullData={props.data}
                mode={mode}
            />

            <h4>Сортировка</h4>
            <Sort
                fields={fields}
                sorting={applySort}
                fullData={props.data}
                currentData={dataTable}
                mode={mode}
            />

            <table className="table">
                <TableHead head={fields} />
                <TableBody body={dataTable} isPagination={props.isPagination}
                           amountRows={props.isPagination ? props.amountRows : null}
                           numPage={props.isPagination ? activePage : null}
                />
            </table>

            <div className="pagination">
                {pages}
            </div>
        </>
    );
};

export default Table;