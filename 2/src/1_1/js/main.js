document.addEventListener("DOMContentLoaded", function() {
    createTable(buildings, 'list');

    let findButton = document.querySelector('input[value="Найти"]');
    let clearButton = document.querySelector('input[value="Очистить фильтры"]');
    let sortButton = document.querySelector('input[value="Сортировать"]');
    let delsortButton = document.querySelector('input[value="Сбросить сортировку"]');
    let dataForm = document.getElementById('filter');
    let dataSort = document.getElementById('sort');
    let firstSort = document.getElementById('fieldsFirst');

    setSortSelects(buildings, dataSort);

    findButton.addEventListener('click', function() {
        filterTable(buildings, 'list', dataForm);
    });

    clearButton.addEventListener('click', function() {
        clearFilter(buildings, 'list', dataForm);
        resetSort('list', buildings, dataSort);
    });

    firstSort.addEventListener('change', function() {
        changeNextSelect(this, 'fieldsSecond');
    });

    sortButton.addEventListener('click', function() {
        sortTable('list', dataSort);
    });

    delsortButton.addEventListener('click', function() {
        resetSort('list', buildings, dataSort);
        clearFilter(buildings, 'list', dataForm);
    });
});

const createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

const setSortSelect = (arr, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
     arr.forEach((item, index) => {
        sortSelect.append(createOption(item, index + 1));
    });
}

const setSortSelects = (data, dataForm) => { 
    const head = Object.keys(data[0]);
    const allSelect = dataForm.getElementsByTagName('select');
    
    for (const item of allSelect) {
        setSortSelect(head, item);
    }
    allSelect[1].disabled = true;
}

const changeNextSelect = (curSelect, nextSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);
    
    nextSelect.disabled = false;
    
    nextSelect.innerHTML = curSelect.innerHTML;
    console.log(nextSelect.innerHTML);
    
    if (curSelect.value != 0) {
       nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
    }
}