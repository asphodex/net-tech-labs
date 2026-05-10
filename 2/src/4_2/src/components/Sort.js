import { useState } from "react";

/*
    компонент для сортировки таблицы по трём уровням
    props:
        fields - массив имён полей (заголовки таблицы)
        sorting - функция, принимающая отсортированный массив
        fullData - исходные (нефильтрованные) данные, нужны для сброса
        currentData - текущие данные таблицы (с учётом фильтра),
                      именно их сортируем при нажатии «Сортировать»
*/
const Sort = (props) => {
    // значения трёх селектов: "0" = «Нет», иначе номер поля (индекс + 1)
    const [first, setFirst] = useState("0");
    const [second, setSecond] = useState("0");
    const [third, setThird] = useState("0");

    // флаги «по убыванию» для каждого уровня
    const [firstDesc, setFirstDesc] = useState(false);
    const [secondDesc, setSecondDesc] = useState(false);
    const [thirdDesc, setThirdDesc] = useState(false);

    // текстовые поля, которые сортируем как строки
    // (всё остальное — Год, Высота — числовые)
    const textFields = ["Название", "Тип", "Страна", "Город"];

    // опция «Нет» + опции по полям; в каждом следующем селекте
    // исключаем поля, уже выбранные в предыдущих
    const buildOptions = (excludeValues) => {
        const options = [
            <option key="0" value="0">Нет</option>
        ];
        props.fields.forEach((field, index) => {
            const value = String(index + 1);
            if (!excludeValues.includes(value)) {
                options.push(
                    <option key={value} value={value}>{field}</option>
                );
            }
        });
        return options;
    };

    // обработчики смены первого/второго селекта:
    // при изменении старшего уровня сбрасываем младшие,
    // как делает changeNextSelect в 3_2
    const handleFirstChange = (event) => {
        setFirst(event.target.value);
        setSecond("0");
        setThird("0");
    };

    const handleSecondChange = (event) => {
        setSecond(event.target.value);
        setThird("0");
    };

    // собираем массив { column, direction } из активных уровней,
    // как createSortArr в 3_2
    const collectSortArr = () => {
        const sortArr = [];
        const levels = [
            { value: first, desc: firstDesc },
            { value: second, desc: secondDesc },
            { value: third, desc: thirdDesc }
        ];
        for (const level of levels) {
            if (level.value === "0") break;
            sortArr.push({
                column: Number(level.value) - 1,
                direction: level.desc
            });
        }
        return sortArr;
    };

    const handleSort = () => {
        const sortArr = collectSortArr();
        // ничего не выбрано — возвращаем текущие данные как есть
        if (sortArr.length === 0) {
            props.sorting(props.currentData);
            return;
        }

        // копируем массив, чтобы не мутировать пропсы
        const sorted = [...props.currentData].sort((a, b) => {
            for (const { column, direction } of sortArr) {
                const key = props.fields[column];
                const firstVal = a[key];
                const secondVal = b[key];

                let comparison;
                if (textFields.includes(key)) {
                    comparison = String(firstVal).localeCompare(String(secondVal));
                } else {
                    comparison = Number(firstVal) - Number(secondVal);
                }
                if (comparison !== 0) {
                    return direction ? -comparison : comparison;
                }
            }
            return 0;
        });

        props.sorting(sorted);
    };

    // сброс сортировки: возвращаем исходные данные и очищаем форму
    const handleReset = () => {
        setFirst("0");
        setSecond("0");
        setThird("0");
        setFirstDesc(false);
        setSecondDesc(false);
        setThirdDesc(false);
        props.sorting(props.fullData);
    };

    return (
        <form className="sort-form">
            <p>Сортировать по</p>

            <p>
                <select value={first} onChange={handleFirstChange}>
                    {buildOptions([])}
                </select>
                по убыванию?{" "}
                <input
                    type="checkbox"
                    checked={firstDesc}
                    onChange={(e) => setFirstDesc(e.target.checked)}
                />
            </p>

            <p>
                <select
                    value={second}
                    onChange={handleSecondChange}
                    disabled={first === "0"}
                >
                    {buildOptions([first])}
                </select>
                по убыванию?{" "}
                <input
                    type="checkbox"
                    checked={secondDesc}
                    onChange={(e) => setSecondDesc(e.target.checked)}
                    disabled={first === "0"}
                />
            </p>

            <p>
                <select
                    value={third}
                    onChange={(e) => setThird(e.target.value)}
                    disabled={first === "0" || second === "0"}
                >
                    {buildOptions([first, second])}
                </select>
                по убыванию?{" "}
                <input
                    type="checkbox"
                    checked={thirdDesc}
                    onChange={(e) => setThirdDesc(e.target.checked)}
                    disabled={first === "0" || second === "0"}
                />
            </p>

            <div className="sort-actions">
                <button type="button" onClick={handleSort}>Сортировать</button>
                <button type="button" onClick={handleReset}>Сбросить сортировку</button>
            </div>
        </form>
    );
};

export default Sort;
