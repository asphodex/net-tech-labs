import { useState } from "react";
import * as d3 from "d3";

import ChartDraw from './ChartDraw.js';

/*
    компонент визуализации данных
    props:
        data - массив объектов с описанием зданий
*/
const Chart = (props) => {
    // выбранное значение по оси OX: "Страна" или "Год"
    const [ox, setOx] = useState("Страна");
    // массив [showMax, showMin]
    const [oy, setOy] = useState([true, false]);
    // тип диаграммы: "scatter" или "bar"
    const [chartType, setChartType] = useState("scatter");
    // текст ошибки (если ничего не выбрано по OY)
    const [error, setError] = useState("");

    /*
        формирует данные для построения графика
        data - исходные данные, key - "Страна" или "Год"
        возвращает массив [{ labelX, values: [min, max] }, ...]
    */
    const createArrGraph = (data, key) => {
        const groupObj = d3.group(data, d => d[key]);

        const arrGraph = Array.from(groupObj, ([labelX, items]) => {
            const minMax = d3.extent(items.map(d => d['Высота']));
            return { labelX, values: minMax };
        });

        // если группируем по году - сортируем по возрастанию
        if (key === "Год") {
            arrGraph.sort((a, b) => Number(a.labelX) - Number(b.labelX));
        }

        return arrGraph;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newOy = [
            event.target["oy"][0].checked,
            event.target["oy"][1].checked
        ];

        // проверка: должно быть выбрано хотя бы одно значение по OY
        if (!newOy[0] && !newOy[1]) {
            setError("Выберите хотя бы одно значение по оси OY (Максимальная или Минимальная высота).");
            return;
        }

        setError("");
        setOx(event.target["ox"].value);
        setOy(newOy);
        setChartType(event.target["chartType"].value);
    };

    const arrGraph = createArrGraph(props.data, ox);
    const hasOy = oy[0] || oy[1];

    return (
        <>
            <h4>Визуализация</h4>
            <form onSubmit={handleSubmit}>
                <p> Значение по оси OX: </p>
                <div>
                    <input type="radio" name="ox" value="Страна" defaultChecked={ox === "Страна"} />
                    Страна
                    <br />
                    <input type="radio" name="ox" value="Год" defaultChecked={ox === "Год"} />
                    Год
                </div>
                <p> Значение по оси OY </p>
                <div>
                    <input type="checkbox" name="oy" defaultChecked={oy[0] === true} />
                    Максимальная высота <br />
                    <input type="checkbox" name="oy" defaultChecked={oy[1] === true} />
                    Минимальная высота
                </div>
                <p>
                    Тип диаграммы{" "}
                    <select name="chartType" defaultValue={chartType}>
                        <option value="scatter">Точечная диаграмма</option>
                        <option value="bar">Гистограмма</option>
                    </select>
                </p>
                <p>
                    <button type="submit">Построить </button>
                </p>
            </form>

            {error && <div className="chart-error">{error}</div>}

            {hasOy && arrGraph.length > 0 && (
                <ChartDraw data={arrGraph} oy={oy} chartType={chartType} />
            )}
        </>
    );
};

export default Chart;
