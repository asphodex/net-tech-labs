const correspond = {
    "Название": "name",
    "Год": ["yearFrom", "yearTo"],
    "Адрес": "address",
    "Район": "district",
    "Тип": "type",
    "Широта": ["latFrom", "latTo"],
    "Долгота": ["lonFrom", "lonTo"]
}

const dataFilter = (dataForm) => {
    let dictFilter = {};

    for (const item of dataForm.elements) {
        let valInput = item.value;

        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type === "number") {
            if (valInput !== '') valInput = Number(valInput);
            else {
                if (item.id && item.id.includes("From")) {
                    valInput = -Infinity;
                } else if (item.id && item.id.includes("To")) {
                    valInput = Infinity;
                }
            }
        }
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
}


const filterTable = (data, idTable, dataForm) => {
    const datafilter = dataFilter(dataForm);
    console.log(datafilter);
    if (Object.values(datafilter).toString() === ['Найти', '', -Infinity, Infinity, '', '', '', -Infinity, Infinity, -Infinity, Infinity, 'Очистить фильтры'].toString()) {
        clearTable(idTable);
        quickHeader(data, idTable);
    } else {
        let tableFilter = data.filter(item => {
            let result = true;
            Object.entries(item).forEach(([key, val]) => {

                if (typeof val == 'string') {
                    result &&= val.toLowerCase().includes(datafilter[correspond[key]]);
                } else if (typeof val == 'number') {
                    if (key === "Год") {
                        result &&= val >= datafilter.yearFrom && val <= datafilter.yearTo;
                    } else if (key === "Широта") {
                        result &&= val >= datafilter.latFrom && val <= datafilter.latTo;
                    } else if (key === "Долгота") {
                        result &&= val >= datafilter.lonFrom && val <= datafilter.lonTo;
                    }
                }
            });

            return result;
        });
        clearTable(idTable);
        if (tableFilter.length === 0) {
            quickHeader(data, idTable);
        } else {
            createTable(tableFilter, idTable);
        }
    }
}

const clearFilter = (data, idTable, dataForm) => {
    const labels = dataForm.querySelectorAll('input[type="text"], input[type="number"]');
    for (const item of labels) item.value = '';
    clearTable(idTable);
    createTable(data, idTable);
}
