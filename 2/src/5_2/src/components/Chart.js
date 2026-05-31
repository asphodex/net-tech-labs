import { useState } from "react";
import * as d3 from "d3";

import ChartDraw from './ChartDraw.js';

/*
    компонент визуализации данных
    props:
        data - массив объектов с описанием достопримечательностей
*/
const Chart = (props) => {
    // текущий год нужен для вычисления возраста объекта
    const CURRENT_YEAR = new Date().getFullYear();

    // выбранное значение по оси OX: "Район" или "Тип"
    const [ox, setOx] = useState("Район");
    // массив [showMin, showMax, showAvg] — какие значения возраста показывать
    const [oy, setOy] = useState([false, true, false]);
    // тип диаграммы: "scatter" или "bar"
    const [chartType, setChartType] = useState("bar");
    const [error, setError] = useState("");

    // черновое состояние чекбоксов до нажатия "Построить"
    const [oyDraft, setOyDraft] = useState([false, true, false]);

    const [isBuilt, setIsBuilt] = useState(true);

    /*
        формирует данные для построения графика
        data - исходные данные, key - "Район" или "Тип"
        возвращает массив [{ labelX, values: [min, max, avg] }, ...]
        где значения — это возраст объектов (текущий год минус год постройки)
    */
    const createArrGraph = (data, key) => {
        const groupObj = d3.group(data, d => d[key]);

        const arrGraph = Array.from(groupObj, ([labelX, items]) => {
            const ages = items.map(d => CURRENT_YEAR - Number(d['Год']));
            const minAge = d3.min(ages);
            const maxAge = d3.max(ages);
            const avgAge = d3.mean(ages);
            // округляем средний возраст до целого
            return { labelX, values: [minAge, maxAge, Math.round(avgAge)] };
        });

        // сортируем по подписи — для устойчивого порядка столбцов
        arrGraph.sort((a, b) => String(a.labelX).localeCompare(String(b.labelX), 'ru'));

        return arrGraph;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!oyDraft[0] && !oyDraft[1] && !oyDraft[2]) {
            setError("Выберите хотя бы одно значение по оси OY (Минимальный, Максимальный или Средний возраст).");
            return;
        }

        setError("");
        setOx(event.target["ox"].value);
        setOy(oyDraft);
        setChartType(event.target["chartType"].value);
        setIsBuilt(true);
    };

    const arrGraph = createArrGraph(props.data, ox);
    const hasOy = oy[0] || oy[1] || oy[2];

    return (
        <>
            <h4>Визуализация</h4>
            <form onSubmit={handleSubmit} onChange={() => error && setError("")}>
                <p> Значение по оси OX: </p>
                <div>
                    <input type="radio" name="ox" value="Район" defaultChecked={ox === "Район"} />
                    Район
                    <br />
                    <input type="radio" name="ox" value="Тип" defaultChecked={ox === "Тип"} />
                    Тип
                </div>
                <p> Значение по оси OY </p>
                <div>
                    <input type="checkbox" name="oy" checked={oyDraft[0]}
                           onChange={(e) => {
                               const next = [e.target.checked, oyDraft[1], oyDraft[2]];
                               setOyDraft(next);
                               if (!next[0] && !next[1] && !next[2]) setIsBuilt(false);
                           }} />
                    Минимальный возраст <br />
                    <input type="checkbox" name="oy" checked={oyDraft[1]}
                           onChange={(e) => {
                               const next = [oyDraft[0], e.target.checked, oyDraft[2]];
                               setOyDraft(next);
                               if (!next[0] && !next[1] && !next[2]) setIsBuilt(false);
                           }} />
                    Максимальный возраст <br />
                    <input type="checkbox" name="oy" checked={oyDraft[2]}
                           onChange={(e) => {
                               const next = [oyDraft[0], oyDraft[1], e.target.checked];
                               setOyDraft(next);
                               if (!next[0] && !next[1] && !next[2]) setIsBuilt(false);
                           }} />
                    Средний возраст
                </div>
                <p>
                    Тип диаграммы{" "}
                    <select name="chartType" defaultValue={chartType}>
                        <option value="scatter">Точечная диаграмма</option>
                        <option value="bar">Столбчатая диаграмма</option>
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
