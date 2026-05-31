const CURRENT_YEAR = 2026;

const SERIES_CONFIG = {
    minAge: {color: "blue", getValue: d => d.min, offset: -16},
    maxAge: {color: "red", getValue: d => d.max, offset: 0},
    avgAge: {color: "green", getValue: d => d.avg, offset: 16},
};

function getVisibleData() {
    const table = document.getElementById("list");
    if (!table) return [];

    const headerCells = table.querySelectorAll("th");
    const headers = Array.from(headerCells).map(th => th.textContent.trim());
    if (headers.length === 0) return [];

    const rows = table.querySelectorAll("tr");
    const data = [];

    for (const row of rows) {
        const cells = row.querySelectorAll("td");
        if (cells.length === 0) continue; // строка заголовка — пропускаем

        const obj = {};
        cells.forEach((cell, i) => {
            const key = headers[i];
            if (!key) return;
            const text = cell.textContent.trim();
            const num = Number(text);
            // числа приводим к числу, остальное оставляем строкой
            obj[key] = (text !== "" && !isNaN(num)) ? num : text;
        });
        data.push(obj);
    }

    return data;
}

function createArrGraph(data, keyX) {
    const groupObj = d3.group(data, d => d[keyX]);
    const arrGraph = [];

    for (const [labelX, items] of groupObj) {
        const ages = items
            .map(d => CURRENT_YEAR - Number(d["Год"]))
            .filter(v => !isNaN(v));

        if (ages.length === 0) continue;

        const min = d3.min(ages);
        const max = d3.max(ages);
        const avg = ages.reduce((s, v) => s + v, 0) / ages.length;

        arrGraph.push({labelX, ages, min, max, avg});
    }

    return arrGraph;
}

function drawGraph(data, series, keyXValue = "Район", typeGraphValue = "dot") {
    if (!Array.isArray(series) || series.length === 0) return;

    const visible = getVisibleData();
    const sourceData = visible.length > 0 ? visible : data;

    const arrGraph = createArrGraph(sourceData, keyXValue);
    if (arrGraph.length === 0) return;

    let svg = d3.select("svg");
    if (svg.empty()) {
        svg = d3.select("body").insert("svg", "#filter")
            .style("width", "800px")
            .style("height", "500px")
            .style("border", "1px solid #ccc")
            .style("margin", "20px 0");
    }
    svg.selectAll("*").remove();

    const attr_area = {
        width: parseFloat(svg.style("width")),
        height: parseFloat(svg.style("height")),
        marginX: 80,
        marginY: 50
    };

    const [scaleX, scaleY] = createAxis(svg, arrGraph, attr_area, series);

    const useOffset = series.length > 1;

    for (const name of series) {
        const cfg = SERIES_CONFIG[name];
        if (!cfg) continue;
        const offset = useOffset ? cfg.offset : 0;
        drawSeries(svg, arrGraph, scaleX, scaleY, attr_area, cfg, offset, typeGraphValue);
    }
}

function clearGraph() {
    const svg = d3.select("svg");
    svg.selectAll("*").remove();
}

function createAxis(svg, data, attr_area, series) {
    const allValues = series.flatMap(name => {
        const cfg = SERIES_CONFIG[name];
        if (!cfg) return [];
        return data.map(d => cfg.getValue(d)).filter(v => v !== undefined && !isNaN(v));
    });

    const max = d3.max(allValues) || 1;

    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.2);

    const scaleY = d3.scaleLinear()
        .domain([0, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

function drawSeries(svg, data, scaleX, scaleY, attr_area, cfg, offset, type) {
    const tx = `translate(${attr_area.marginX}, ${attr_area.marginY})`;
    const chartHeight = attr_area.height - 2 * attr_area.marginY;

    const cx = d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + offset;
    const cy = d => {
        const v = cfg.getValue(d);
        return (v === undefined || isNaN(v)) ? scaleY(0) : scaleY(v);
    };

    if (type === "bar") {
        const barWidth = Math.max(4, scaleX.bandwidth() / 4);
        svg.selectAll(null)
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => cx(d) - barWidth / 2)
            .attr("y", cy)
            .attr("width", barWidth)
            .attr("height", d => chartHeight - cy(d))
            .attr("transform", tx)
            .style("fill", cfg.color);
    } else if (type === "line") {
        const line = d3.line().x(cx).y(cy).curve(d3.curveCatmullRom.alpha(0.5));
        svg.append("path")
            .datum(data)
            .attr("transform", tx)
            .attr("fill", "none")
            .attr("stroke", cfg.color)
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.selectAll(null)
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 4)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("transform", tx)
    } else {
        // dot по умолчанию
        svg.selectAll(null)
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 4)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("transform", tx)
            .style("fill", cfg.color);
    }
}