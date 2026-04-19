function createArrGraph(data, key) {
    const groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];

    for (let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d["Высота"]));
        arrGraph.push({
            labelX: entry[0],
            values: minMax
        });
    }

    return arrGraph;
}

function drawGraph(data, mode = 0, keyXValue = "Страна", typeGraphValue = "dot") {
    const arrGraph = createArrGraph(data, keyXValue);

    const svg = d3.select("svg");
    svg.selectAll("*").remove();

    const attr_area = {
        width: parseFloat(svg.style("width")),
        height: parseFloat(svg.style("height")),
        marginX: 50,
        marginY: 50
    };

    const [scX, scY] = createAxis(svg, arrGraph, attr_area, mode);

    if (typeGraphValue === "bar")
        createChartBar(svg, arrGraph, scX, scY, attr_area, "red", mode);
    else
        createChartCircle(svg, arrGraph, scX, scY, attr_area, "red", mode);
}


function clearGraph() {
    const svg = d3.select("svg");
    svg.selectAll("*").remove();
}

function createAxis(svg, data, attr_area, mode) {
    const [min, max] = d3.extent(data.flatMap(d => d.values));

    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.2);

    var scaleY;
    if (mode == 1) { // если по самым маленьким
        const minMax = d3.max(data.map(d => d.values[0]));
        scaleY = d3.scaleLinear()
            .domain([min * 0.85, minMax * 1.1])
            .range([attr_area.height - 2 * attr_area.marginY, 0]);
    } else { // остальные
        scaleY = d3.scaleLinear()
            .domain([min * 0.85, max * 1.1])
            .range([attr_area.height - 2 * attr_area.marginY, 0]);
    }

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

function createChartCircle(svg, data, scaleX, scaleY, attr_area, color, mode) {
    const r = 4;

    if (mode == 0 || mode == 2) {
        svg.selectAll(".dot-max")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot-max")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[1]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color);
    } else if (mode == 1) {
        svg.selectAll(".dot-min")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot-min")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }

    if (mode == 2) {
        svg.selectAll(".dot-min")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot-min")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + 6)
            .attr("cy", d => scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }
}

function createChartBar(svg, data, scaleX, scaleY, attr_area, color, mode) {
    const chartHeight = attr_area.height - 2 * attr_area.marginY;
    const singleBarWidth = Math.max(6, scaleX.bandwidth() * 0.55);
    const doubleBarWidth = Math.max(4, scaleX.bandwidth() / 2 - 4);

    if (mode == 0 || mode == 2) {
        svg.selectAll(".bar-max")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar-max")
            .attr("x", d => scaleX(d.labelX) + (mode == 2 ? 2 : (scaleX.bandwidth() - singleBarWidth) / 2))
            .attr("y", d => scaleY(d.values[1]))
            .attr("width", mode == 2 ? doubleBarWidth : singleBarWidth)
            .attr("height", d => chartHeight - scaleY(d.values[1]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color);
    } else if (mode == 1) {
        svg.selectAll(".bar-min")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar-min")
            .attr("x", d => scaleX(d.labelX) + (scaleX.bandwidth() - singleBarWidth) / 2)
            .attr("y", d => scaleY(d.values[0]))
            .attr("width", singleBarWidth)
            .attr("height", d => chartHeight - scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }

    if (mode == 2) {
        svg.selectAll(".bar-min")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar-min")
            .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + 2)
            .attr("y", d => scaleY(d.values[0]))
            .attr("width", doubleBarWidth)
            .attr("height", d => chartHeight - scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }
}