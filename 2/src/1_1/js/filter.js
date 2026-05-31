const correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
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

    if (Object.values(datafilter).toString() === ['Найти', '', '', '', '', -Infinity, Infinity, -Infinity, Infinity, 'Очистить фильтры'].toString()) {
        clearTable(idTable);
        quickHeader(data, idTable);
    } else {
        let tableFilter = data.filter(item => {
            let result = true;
            Object.entries(item).forEach(([key, val]) => {

                if (key === "Год") {
                    result &&= val >= datafilter.yearFrom && val <= datafilter.yearTo;
                } else if (key === "Высота") {
                    result &&= val >= datafilter.heightFrom && val <= datafilter.heightTo;
                } else {
                    result &&= String(val).toLowerCase().includes(datafilter[correspond[key]]);
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