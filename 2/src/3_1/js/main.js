document.addEventListener("DOMContentLoaded", function() {
    showTable("build", buildings);

    drawGraph(buildings);
});

document.addEventListener("DOMContentLoaded", function() {
    const tableBtn = document.getElementById("tableBtn");

    tableBtn.addEventListener("click", function() {
        const isHide = tableBtn.value === "Скрыть таблицу";

        if (isHide) {
            tableBtn.value = "Показать таблицу";
            clearTable("build");
        } else {
            tableBtn.value = "Скрыть таблицу";
            showTable("build", buildings);
        }
    });


    const settings = document.getElementById("settings");

    // настройки для графика
    const minY      = settings.querySelector("#minY");
    const maxY      = settings.querySelector("#maxY");
    const typeGraph = settings.querySelector("#typeGraph");

    // кнопка
    const buildBtn = settings.querySelector("#buildBtn");

    const err = document.getElementById("err");
    var selectedChart = 0;

    buildBtn.addEventListener("click", function() {
        const keyX = settings.querySelector("input[name='keyX']:checked");

        clearErr();

        if (minY.checked && maxY.checked)
            selectedChart = 2;
        else if (minY.checked && !maxY.checked)
            selectedChart = 1;
        else if (!minY.checked && maxY.checked)
            selectedChart = 0;
        else {
            showErr(err);
            return;
        }

        clearGraph();
        drawGraph(buildings, selectedChart, keyX.value, typeGraph.value);
    });
});

function showErr(err) {
    err.insertAdjacentHTML("afterbegin", "<p class=\"errMessage\">Выберите хотя бы одно значение по оси OY</p>");
}

function clearErr() {
    var errMessage = document.querySelector(".errMessage");
    if (errMessage)
        errMessage.remove();
}