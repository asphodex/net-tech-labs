let filterForm;
let sortForm;

const createTableRow = (place) => {
    const row = document.createElement("tr");

    row.className = "places-table__row";
    row.innerHTML = `
          <td class="places-table__cell">${place.name}</td>
          <td class="places-table__cell">${place.year}</td>
          <td class="places-table__cell">${place.address}</td>
          <td class="places-table__cell">${place.district}</td>
          <td class="places-table__cell">${place.type}</td>
          <td class="places-table__cell">${place.lat}</td>
          <td class="places-table__cell">${place.lon}</td>
      `;

    return row;
}

const renderPlacesTable = (places, containerId) => {
    const tbody = document.getElementById(containerId);

    tbody.innerHTML = "";

    places
        .map(createTableRow)
        .forEach(row => tbody.appendChild(row));
}

const getFilterValues = () => {
    const formData = new FormData(filterForm);

    return {
        name: formData.get("name"),
        yearFrom: formData.get("year_from"),
        yearTo: formData.get("year_to"),
        address: formData.get("address"),
        district: formData.get("district"),
        type: formData.get("type"),
        latFrom: formData.get("lat_from"),
        latTo: formData.get("lat_to"),
        lonFrom: formData.get("lon_from"),
        lonTo: formData.get("lon_to")
    }
}

const handleFilter = (e) => {
    e.preventDefault();

    const values = getFilterValues();
    const filters = [
        filterByName(values.name),
        filterByYear(values.yearFrom, values.yearTo),
        filterByAddress(values.address),
        filterByDistrict(values.district),
        filterByType(values.type),
        filterByLatitude(values.latFrom, values.latTo),
        filterByLongitude(values.lonFrom, values.lonTo)
    ];

    const filteredPlaces = applyFilters(places, filters);
    renderPlacesTable(filteredPlaces, "places-table__body");
}

const getSortValues = () => {
    const formData = new FormData(sortForm);

    return [
        {
            field: formData.get('sort1'),
            desc: formData.has('sort1_desc')
        },
        {
            field: formData.get('sort2'),
            desc: formData.has('sort2_desc')
        },
        {
            field: formData.get('sort3'),
            desc: formData.has('sort3_desc')
        }
    ].filter(level => level.field !== 'none');
}

const handleSort = (e) => {
    e.preventDefault();

    const sortLevels = getSortValues();
    const sortedPlaces = sortPlaces(places, sortLevels);
    renderPlacesTable(sortedPlaces, "places-table__body");
}

const updateSortOptions = () => {
    const selects = ["sort1", "sort2", "sort3"];
    const values = selects.map(name => sortForm.elements[name].value);

    selects.forEach((selectName, index) => {
        const select = sortForm.elements[selectName];

        Array.from(select.options).forEach(option => {
            if (option.value === "none") return;

            option.disabled = values.some((val, i) =>
                i !== index && val === option.value && val !== 'none'
            );
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    filterForm = document.getElementById("filter-form");
    sortForm = document.getElementById("sort-form");

    renderPlacesTable(places, "places-table__body");

    filterForm.addEventListener("submit", handleFilter);
    sortForm.addEventListener("submit", handleSort);

    const selects = ["sort1", "sort2", "sort3"];
    selects.forEach(name => {
        sortForm.elements[name].addEventListener("change", updateSortOptions);
    });

    updateSortOptions();
});