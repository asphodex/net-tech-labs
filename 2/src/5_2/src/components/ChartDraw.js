import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

/*
    компонент для рисования диаграммы
    props:
        data       - массив объектов вида { labelX, values: [min, max, avg] }
        oy         - массив [showMin, showMax, showAvg]: какие значения показывать
        chartType  - "scatter" (точечная) или "bar" (столбчатая)
*/
const ChartDraw = (props) => {
    const chartRef = useRef(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // заносим в состояния ширину и высоту svg-элемента
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        setWidth(parseFloat(svg.style('width')));
        setHeight(parseFloat(svg.style('height')));
    }, []);

    // задаем отступы в svg-элементе
    const margin = {
        top: 20,
        bottom: 70,
        left: 50,
        right: 120 // расширили правый отступ под легенду
    };

    // вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    // какие индексы values нужно отображать:
    // 0 - минимальный возраст, 1 - максимальный возраст, 2 - средний возраст
    const [showMin, showMax, showAvg] = props.oy;
    const activeIndexes = useMemo(() => (
        [
            showMin ? 0 : null,
            showMax ? 1 : null,
            showAvg ? 2 : null
        ].filter(i => i !== null)
    ), [showMin, showMax, showAvg]);

    // диапазон по оси Y берём по всем активным значениям
    const allValues = props.data.flatMap(d =>
        activeIndexes.map(i => d.values[i])
    );
    const [minVal, maxVal] = allValues.length > 0
        ? d3.extent(allValues)
        : [0, 1];

    // формируем шкалы для осей
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(props.data.map(d => d.labelX))
            .range([0, boundsWidth])
            .padding(0.1);
    }, [props.data, boundsWidth]);

    const scaleY = useMemo(() => {
        // минимальный возраст может быть равен 0 — оставляем 0 как нижнюю границу
        const lower = Math.min(0, minVal);
        const upper = maxVal * 1.1 || 1;
        return d3
            .scaleLinear()
            .domain([lower, upper])
            .range([boundsHeight, 0]);
    }, [boundsHeight, minVal, maxVal]);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        // цвета и подписи для серий
        const colorByIndex = { 0: "#1f77b4", 1: "#d62728", 2: "#2ca02c" };
        const labelByIndex = { 0: "Минимальный возраст", 1: "Максимальный возраст", 2: "Средний возраст" };

        // рисуем оси
        const xAxis = d3.axisBottom(scaleX);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        // подпись оси Y
        svg.append("text")
            .attr("transform", `translate(15, ${margin.top + boundsHeight / 2}) rotate(-90)`)
            .style("text-anchor", "middle")
            .style("font", "10px Verdana")
            .text("Возраст, лет");

        if (props.chartType === "bar") {
            // СТОЛБЧАТАЯ ДИАГРАММА
            const innerBand = scaleX.bandwidth() / activeIndexes.length;

            activeIndexes.forEach((idx, seriesPos) => {
                svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .selectAll(`.bar-${idx}`)
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + seriesPos * innerBand)
                    .attr("y", d => scaleY(d.values[idx]))
                    .attr("width", innerBand)
                    .attr("height", d => boundsHeight - scaleY(d.values[idx]))
                    .style("fill", colorByIndex[idx]);
            });
        } else {
            // ТОЧЕЧНАЯ ДИАГРАММА
            // равномерно распределяем точки внутри одной группы
            const n = activeIndexes.length;
            const offset = 5; // пиксели

            activeIndexes.forEach((idx, seriesPos) => {
                // shift распределяет точки от -offset*(n-1)/2 до +offset*(n-1)/2
                const shift = n === 1
                    ? 0
                    : (seriesPos - (n - 1) / 2) * 2 * offset;

                svg.selectAll(`.dot-${idx}`)
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
                    .attr("cy", d => scaleY(d.values[idx]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", colorByIndex[idx]);
            });
        }

        // ЛЕГЕНДА — справа от области диаграммы
        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left + boundsWidth + 15}, ${margin.top})`);

        activeIndexes.forEach((idx, i) => {
            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 18})`);

            row.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", colorByIndex[idx]);

            row.append("text")
                .attr("x", 16)
                .attr("y", 10)
                .style("font", "10px Verdana")
                .text(labelByIndex[idx]);
        });
    }, [scaleX, scaleY, props.data, props.oy, props.chartType, height, activeIndexes, boundsHeight, boundsWidth, margin.left, margin.top, margin.bottom]);

    return (
        <svg ref={chartRef}> </svg>
    );
};

export default ChartDraw;
