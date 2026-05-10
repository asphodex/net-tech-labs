import { useState } from "react";

import '../css/App.css';
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import Sort from './Sort.js';

/*
    компонент, выводящий на страницу таблицу
    props:
        data - данные для таблицы в виде массива объектов
*/
const Table = (props) => {
    const [dataTable, setDataTable] = useState(props.data);
    
    const n = Math.max(1, Math.ceil(dataTable.length / props.amountRows));
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const [activePage, setActivePage] = useState(n.toString());
    const changeActive = (event) => {
        setActivePage(event.target.innerHTML);
    };

    // обновление данных от фильтра — оставляем поведение из исходника:
    // прыгаем на последнюю страницу
    const updateDataTable = (value) => {
        setDataTable(value);
        const lastPage = Math.max(1, Math.ceil(value.length / props.amountRows));
        setActivePage(lastPage.toString());
    };

    // обновление данных от сортировки — порядок строк поменялся,
    // но их количество то же; переходим на первую страницу
    const applySort = (value) => {
        setDataTable(value);
        setActivePage("1");
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

    return(
        <>
            <h4>Фильтры</h4>
            <Filter filtering={updateDataTable} fullData={props.data} />

            <h4>Сортировка</h4>
            <Sort
                fields={fields}
                sorting={applySort}
                fullData={props.data}
                currentData={dataTable}
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
