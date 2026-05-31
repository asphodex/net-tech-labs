const createSortArr = (data) => {
    let sortArr = [];
    const sortSelects = data.getElementsByTagName('select');
    
    for (const item of sortSelects) {   
        const keySort = item.value;
        if (keySort === 0) {
            break;
        }
        const desc = document.getElementById(item.id + 'Desc').checked;
        sortArr.push(
          {column: keySort - 1, 
           direction: desc}
        ); 
    }
    return sortArr; 
};

const sortTable = (idTable, formData) => {
    const sortArr = createSortArr(formData);
    console.log(sortArr);
    if (sortArr.length === 0) {
        clearTable(idTable);
        createTable(buildings, idTable);
        return false;
    }
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
     const headerRow = rowData.shift();
    rowData.sort((first, second) => {
        for (let {column, direction} of sortArr) {
            const firstCell = first.cells[column].innerHTML;
            const secondCell = second.cells[column].innerHTML;
            console.log(firstCell, '----',secondCell);

            if (column === 4 || column === 5) {
                const firstVal = parseFloat(firstCell);
                const secondVal = parseFloat(secondCell);
                comparison = firstVal - secondVal;
            }
            else {
                comparison = firstCell.localeCompare(secondCell);
            }		      
            if (comparison !== 0) {
                return (direction ? -comparison : comparison);
            }
        }
        return 0; 
    });
    
    table.append(headerRow);
	
	let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
	table.append(tbody);
};

const resetSort = (idTable, data, dataSort) => {
    const allSelect = dataSort.getElementsByTagName('select');
    for (const item of allSelect) {
        item.selectedIndex = 0;
    }
    allSelect[1].disabled = true;

    clearTable(idTable);
    createTable(data, idTable);
};