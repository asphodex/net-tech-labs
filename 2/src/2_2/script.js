const svg = d3.select("#canvas");

let figureGroup = null;

let trajectoryPath = null;

let isAnimating = false;

const M_POINTS = [
    [480, 400],  // старт, правая нижняя точка
    [480, 100],  // вверх, правая верхняя
    [300, 280],  // вниз к центру
    [120, 100],  // вверх, левая верхняя
    [120, 400],  // вниз, левая нижняя, конец
];


function drawFigure() {
    // повторное рисование
    if (figureGroup) return;

    // генератор линий, возвращает строку SVG path
    const lineGenerator = d3.line()
        .x(d => d[0])
        .y(d => d[1]);

    // создание <path>
    trajectoryPath = svg.append("path")
        .attr("d", lineGenerator(M_POINTS))
        .attr("fill", "none")
        .attr("stroke", "#3b3f54")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "8,6")
        .attr("class", "trajectory");

    // добавляем circle к вершинам и заливаем
    svg.selectAll(".vertex-marker")
        .data(M_POINTS)
        .join("circle")
        .attr("class", "vertex-marker")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 4)
        .attr("fill", "#3b3f54");

    // выделяем красным стартовую точку
    svg.append("circle")
        .attr("class", "start-marker")
        .attr("cx", M_POINTS[0][0]) // 480
        .attr("cy", M_POINTS[0][1]) // 400
        .attr("r", 6)
        .attr("fill", "#ef4444")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

    // группа для робота
    figureGroup = svg.append("g")
        .attr("transform", `translate(${M_POINTS[0][0]}, ${M_POINTS[0][1]})`);

    // корпус робота
    figureGroup.append("rect")
        .attr("x", -15) // сдвиг влево от центра
        .attr("y", -20) // сдвиг вверх от центра
        .attr("width", 30)
        .attr("height", 35)
        .attr("rx", 4) // скругление углов
        .attr("fill", "#6c63ff")
        .attr("stroke", "#8b83ff")
        .attr("stroke-width", 1.5);

    // голова
    figureGroup.append("circle")
        .attr("cx", 0)
        .attr("cy", -28) // выше корпуса
        .attr("r", 12) // радиус
        .attr("fill", "#818cf8")
        .attr("stroke", "#a5b4fc")
        .attr("stroke-width", 1.5);

    // антенна
    figureGroup.append("line")
        .attr("x1", 0)
        .attr("y1", -40) // начало, над головой
        .attr("x2", 0)
        .attr("y2", -50) // конец, ещё выше
        .attr("stroke", "#f59e0b")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round"); // скруглённый конец линии

    // кончик у антенны
    figureGroup.append("circle")
        .attr("cx", 0)
        .attr("cy", -52)
        .attr("r", 3)
        .attr("fill", "#f59e0b");

    // левый глаз
    figureGroup.append("ellipse")
        .attr("cx", -5)
        .attr("cy", -30)
        .attr("rx", 3)
        .attr("ry", 4)
        .attr("fill", "#fff");

    // правый глаз
    figureGroup.append("ellipse")
        .attr("cx", 5)
        .attr("cy", -30)
        .attr("rx", 3)
        .attr("ry", 4)
        .attr("fill", "#fff");

    // левая нога, треугольник
    figureGroup.append("polygon")
        .attr("points", "-14,15  -20,25  -8,25")
        .attr("fill", "#4f46e5");

    // правая нога
    figureGroup.append("polygon")
        .attr("points", "14,15  20,25  8,25")
        .attr("fill", "#4f46e5");

}


function startAnimation() {
    // не нарисовано
    if (!figureGroup) return;

    if (isAnimating) return;

    isAnimating = true;

    const duration = +document.getElementById("duration").value;
    const scaleStart = +document.getElementById("scaleStart").value;
    const scaleEnd = +document.getElementById("scaleEnd").value;
    const rotationStart = +document.getElementById("rotationStart").value;
    const rotationEnd = +document.getElementById("rotationEnd").value;
    const easingName = document.getElementById("easing").value;
    const enableRotation = document.getElementById("enableRotation").checked;
    const enableScale = document.getElementById("enableScale").checked;
    const showTrajectory = document.getElementById("showTrajectory").checked;

    // видимость траектории
    svg.selectAll(".trajectory, .vertex-marker, .start-marker")
        .attr("opacity", showTrajectory ? 1 : 0);

    // функция плавности
    const easingFn = d3[easingName] || d3.easeLinear;

    // d3 в DOM элемент
    const pathNode = trajectoryPath.node();
    const totalLength = pathNode.getTotalLength();

    // запуск анимации
    figureGroup.transition()
        .duration(duration)
        .ease(easingFn)
        .attrTween("transform", function () {
            return function (t) {
                const point = pathNode.getPointAtLength(t * totalLength);

                // масштаб
                const currentScale = enableScale
                    ? scaleStart + (scaleEnd - scaleStart) * t
                    : 1;

                // вращение
                const currentRotation = enableRotation
                    ? rotationStart + (rotationEnd - rotationStart) * t
                    : 0;

                // собираем строку transform
                return `translate(${point.x}, ${point.y}) rotate(${currentRotation}) scale(${currentScale})`;
            };
        })
        .on("end", function () {
            isAnimating = false;
        });
}


function clearCanvas() {
    if (figureGroup) {
        figureGroup.interrupt();
    }

    // удалить все
    svg.selectAll("*").remove();

    figureGroup = null;
    trajectoryPath = null;
    isAnimating = false;
}
