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
            "Название": event.target.structure.value.toLowerCase(),
            "Тип": event.target.type.value.toLowerCase(),
            "Страна": event.target.country.value.toLowerCase(),
            "Город": event.target.city.value.toLowerCase(),
            "Год": [
                event.target.yearFrom.value,
                event.target.yearTo.value
            ],
            "Высота": [
                event.target.heightFrom.value,
                event.target.heightTo.value
            ]
        };

        let arr = props.fullData;

        const textFields = ["Название", "Тип", "Страна", "Город"];
        textFields.forEach((key) => {
            if (filterField[key] !== "") {
                arr = arr.filter((item) =>
                    String(item[key]).toLowerCase().includes(filterField[key])
                );
            }
        });

        const numberFields = ["Год", "Высота"];
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
            <input name="structure" type="text" />

            <label className="filter-label">Тип:</label>
            <input name="type" type="text" />

            <label className="filter-label">Страна:</label>
            <input name="country" type="text" />

            <label className="filter-label">Город:</label>
            <input name="city" type="text" />

            <label className="filter-label">Высота от:</label>
            <input name="heightFrom" type="number" />

            <label className="filter-label">Высота до:</label>
            <input name="heightTo" type="number" />

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
