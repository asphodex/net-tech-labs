/*
    компонент для фильтрации таблицы
    props:
        fullData - полные данные
        filtering - функция обновления данных для фильтрации
*/
const Filter = (props) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        const filterField = {
            "Название": event.target.name.value.toLowerCase(),
            "Тип": event.target.type.value.toLowerCase(),
            "Адрес": event.target.address.value.toLowerCase(),
            "Район": event.target.district.value.toLowerCase(),
            "Год": [
                event.target.yearFrom.value,
                event.target.yearTo.value
            ]
        };

        let arr = props.fullData;

        const textFields = ["Название", "Тип", "Адрес", "Район"];
        textFields.forEach((key) => {
            if (filterField[key] !== "") {
                arr = arr.filter((item) =>
                    String(item[key]).toLowerCase().includes(filterField[key])
                );
            }
        });

        const numberFields = ["Год"];
        numberFields.forEach((key) => {
            const [minValue, maxValue] = filterField[key];

            if (minValue !== "") {
                arr = arr.filter((item) => Number(item[key]) >= Number(minValue));
            }

            if (maxValue !== "") {
                arr = arr.filter((item) => Number(item[key]) <= Number(maxValue));
            }
        });

        props.filtering(arr);
    };

    const handleReset = () => {
        props.filtering(props.fullData);
    };

    return (
        <form className="filter-form" onSubmit={handleSubmit} onReset={handleReset}>
            <label className="filter-label">Название:</label>
            <input name="name" type="text" />

            <label className="filter-label">Тип:</label>
            <input name="type" type="text" />

            <label className="filter-label">Адрес:</label>
            <input name="address" type="text" />

            <label className="filter-label">Район:</label>
            <input name="district" type="text" />

            <label className="filter-label">Год от:</label>
            <input name="yearFrom" type="number" />

            <label className="filter-label">Год до:</label>
            <input name="yearTo" type="number" />

            <div className="filter-actions">
                <button type="submit">Фильтровать</button>
                <button type="reset">Очистить фильтры</button>
            </div>
        </form>
    );
};

export default Filter;
