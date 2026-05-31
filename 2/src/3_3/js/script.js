document.addEventListener("DOMContentLoaded", function () {
    let svg = d3.select("#svg");

    const r = 10;

    const x1 = 20, y1 = 20;
    const x2 = 280, y2 = 280;

    const circle = svg.append("circle")
        .attr("cx", x1)
        .attr("cy", y1)
        .attr("r", r)
        .attr("fill", "blue")

    let t = 1500;


    const go = () => {
        circle
            .transition().duration(t).ease(d3.easeLinear).attr("cx", x2).attr("cy", y1)
            .transition().duration(t).ease(d3.easeLinear).attr("cx", x1).attr("cy", y2)
            .transition().duration(t).ease(d3.easeLinear).attr("cx", x2).attr("cy", y2)
            .transition().duration(t).ease(d3.easeLinear).attr("cx", x1).attr("cy", y1)
            .on("end", go);
    }

    go();
});