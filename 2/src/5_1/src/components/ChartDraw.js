import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

/*
    компонент для рисования диаграммы (точечной или гистограммы)
    props:
        data       - массив объектов вида { labelX, values: [min, max] }
        oy         - массив [showMax, showMin]: какие значения показывать
        chartType  - "scatter" (точечная) или "bar" (гистограмма)
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
    });

    // задаем отступы в svg-элементе
    const margin = {
        top: 10,
        bottom: 60,
        left: 40,
        right: 10
    };

    // вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    // какие индексы values нужно отображать:
    // 0 - минимальная высота, 1 - максимальная высота
    const [showMax, showMin] = props.oy;
    const activeIndexes = useMemo(() => (
        [showMax ? 1 : null, showMin ? 0 : null].filter(i => i !== null)
    ), [showMax, showMin]);

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
        return d3
            .scaleLinear()
            .domain([minVal * 0.85, maxVal * 1.1])
            .range([boundsHeight, 0]);
    }, [boundsHeight, minVal, maxVal]);

    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        // рисуем оси
        const xAxis = d3.axisBottom(scaleX);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        // цвета для серий: max - красный, min - синий
        const colorByIndex = { 1: "red", 0: "blue" };

        if (props.chartType === "bar") {
            // ГИСТОГРАММА
            // если показываем обе серии — делим bandwidth пополам
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
            activeIndexes.forEach((idx) => {
                svg.selectAll(`.dot-${idx}`)
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", d => scaleY(d.values[idx]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", colorByIndex[idx]);
            });
        }
    }, [scaleX, scaleY, props.data, props.oy, props.chartType, height, activeIndexes, boundsHeight, margin.left, margin.top, margin.bottom]);

    return (
        <svg ref={chartRef}> </svg>
    );
};

export default ChartDraw;
