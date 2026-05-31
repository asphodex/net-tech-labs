import { useRef, useEffect } from "react";

const Filter = (props) => {
    const formRef = useRef(null);

    useEffect(() => {
        if (props.mode === "reset" && formRef.current) {
            formRef.current.reset();
        }
    }, [props.mode]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const filterField = {
            "Название": event.target.name.value.toLowerCase(),
            "Адрес": event.target.address.value.toLowerCase(),
            "Район": event.target.district.value.toLowerCase(),
            "Тип": event.target.type.value.toLowerCase(),
            "Год": [
                event.target.yearFrom.value,
                event.target.yearTo.value
            ],
            "Широта": [
                event.target.latFrom.value,
                event.target.latTo.value
            ],
            "Долгота": [
                event.target.lonFrom.value,
                event.target.lonTo.value
            ]
        };

        let arr = props.fullData;

        const textFields = ["Название", "Адрес", "Район", "Тип"];
        textFields.forEach((key) => {
            if (filterField[key] !== "") {
                arr = arr.filter((item) =>
                    String(item[key]).toLowerCase().includes(filterField[key])
                );
            }
        });

        const numberFields = ["Год", "Широта", "Долгота"];
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
        <form
            ref={formRef}
            className="filter-form"
            onSubmit={handleSubmit}
            onReset={handleReset}
        >
            <label className="filter-label">Название:</label>
            <input name="name" type="text" />

            <label className="filter-label">Адрес:</label>
            <input name="address" type="text" />

            <label className="filter-label">Район:</label>
            <input name="district" type="text" />

            <label className="filter-label">Тип:</label>
            <input name="type" type="text" />

            <label className="filter-label">Год от:</label>
            <input name="yearFrom" type="number" />

            <label className="filter-label">Год до:</label>
            <input name="yearTo" type="number" />

            <label className="filter-label">Широта от:</label>
            <input name="latFrom" type="number" step="0.0001" />

            <label className="filter-label">Широта до:</label>
            <input name="latTo" type="number" step="0.0001" />

            <label className="filter-label">Долгота от:</label>
            <input name="lonFrom" type="number" step="0.0001" />

            <label className="filter-label">Долгота до:</label>
            <input name="lonTo" type="number" step="0.0001" />

            <div className="filter-actions">
                <button type="submit">Фильтровать</button>
                <button type="reset">Очистить фильтры</button>
            </div>
        </form>
    );
};

export default Filter;