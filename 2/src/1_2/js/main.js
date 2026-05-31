document.addEventListener("DOMContentLoaded", function() {
    createTable(places, 'list');

    let findButton = document.querySelector('input[value="Найти"]');
    let clearButton = document.querySelector('input[value="Очистить фильтры"]');
    let sortButton = document.querySelector('input[value="Сортировать"]');
    let delsortButton = document.querySelector('input[value="Сбросить сортировку"]');
    let dataForm = document.getElementById('filter');
    let dataSort = document.getElementById('sort');
    let firstSort = document.getElementById('fieldsFirst');
    let secondSort = document.getElementById('fieldsSecond');

    setSortSelects(places, dataSort);

    findButton.addEventListener('click', function() {
        filterTable(places, 'list', dataForm);
    });

    clearButton.addEventListener('click', function() {
        clearFilter(places, 'list', dataForm);
        resetSort('list', places, dataSort);
    });

    firstSort.addEventListener('change', function() {
        changeNextSelect(this, 'fieldsSecond');
        let fieldsThird = document.getElementById('fieldsThird');
        fieldsThird.disabled = true;
        fieldsThird.innerHTML = document.getElementById('fieldsSecond').innerHTML;
    });

    secondSort.addEventListener('change', function() {
        changeNextSelect(this, 'fieldsThird');
    });

    sortButton.addEventListener('click', function() {
        sortTable('list', dataSort);
    });

    delsortButton.addEventListener('click', function() {
        resetSort('list', places, dataSort);
        clearFilter(places, 'list', dataForm);
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
    allSelect[2].disabled = true;
}

const changeNextSelect = (curSelect, nextSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);

    nextSelect.disabled = false;

    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.selectedIndex);
    } else {
        nextSelect.disabled = true;
    }
}
