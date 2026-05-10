import { useState } from "react";

import '../css/App.css';
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';

/*
    компонент, выводящий на страницу таблицу
    props:
        data - данные для таблицы в виде массива объектов
*/
const Table = (props) => {
    const [dataTable, setDataTable] = useState(props.data);
    
    const n = Math.max(1, Math.ceil(dataTable.length / props.amountRows));
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const [activePage, setActivePage] = useState("1");
    const changeActive = (event) => {
        setActivePage(event.target.innerHTML);
    };

    const updateDataTable = (value) => {
        setDataTable(value);
        setActivePage("1");

        // уведомляем родителя об изменении отфильтрованных данных
        if (props.onFilteredDataChange) {
            props.onFilteredDataChange(value);
        }
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

    return(
        <>
            <h4>Фильтры</h4>
            <Filter filtering={updateDataTable} fullData={props.data} />

            <table className="table">
                <TableHead head={Object.keys(props.data[0])} />
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
