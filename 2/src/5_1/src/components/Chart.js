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
    const [error, setError] = useState("");

    const [oyDraft, setOyDraft] = useState([true, false]);

    const [isBuilt, setIsBuilt] = useState(true);

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

        if (!oyDraft[0] && !oyDraft[1]) {
            setError("Выберите хотя бы одно значение по оси OY (Максимальная или Минимальная высота).");
            return;
        }

        setError("");
        setOx(event.target["ox"].value);
        setOy(oyDraft);
        setChartType(event.target["chartType"].value);
        setIsBuilt(true);
    };

    const arrGraph = createArrGraph(props.data, ox);
    const hasOy = oy[0] || oy[1];

    return (
        <>
            <h4>Визуализация</h4>
            <form onSubmit={handleSubmit} onChange={() => error && setError("")}>
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
                    <input type="checkbox" name="oy"  checked={oyDraft[0]}
                           onChange={(e) => {
                               const next = [e.target.checked, oyDraft[1]];
                               setOyDraft(next);
                               if (!next[0] && !next[1]) setIsBuilt(false);
                           }} />
                    Максимальная высота <br />
                    <input type="checkbox" name="oy"  checked={oyDraft[1]}
                           onChange={(e) => {
                               const next = [oyDraft[0], e.target.checked];
                               setOyDraft(next);
                               if (!next[0] && !next[1]) setIsBuilt(false);
                           }} />
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

            {isBuilt && hasOy && arrGraph.length > 0 && (
                <ChartDraw data={arrGraph} oy={oy} chartType={chartType} />
            )}
        </>
    );
};

export default Chart;
