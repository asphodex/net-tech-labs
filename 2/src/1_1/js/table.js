const createTable = (data, idTable) => {
    const table = document.getElementById(idTable);
    const header = Object.keys(data[0]);

    /* создание шапки таблицы */
    const headerRow = createHeaderRow(header);
    table.append(headerRow);

    /* создание тела таблицы */
    const bodyRows = createBodyRows(data);
    table.append(bodyRows);
};

const quickHeader = (data, idTable) => {
    const table = document.getElementById(idTable);
    const header = Object.keys(data[0]);
    const headerRow = createHeaderRow(header);
    table.append(headerRow);
};

const createHeaderRow = (headers) => {
    const tr = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerHTML = header;
        tr.append(th);
    });
    return tr;
};

const createBodyRows = (data) => {
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(item => {
            const td = document.createElement('td');
            td.innerHTML = item;
            tr.append(td);
        });
        tbody.append(tr);
    });
    return tbody;
};


const clearTable = (idTable) => {
    const table = document.getElementById(idTable);
    if (table) {
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    }
};
