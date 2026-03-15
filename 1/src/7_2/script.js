const InputType = {
    SIDES_ANGLE: 'sides-angle',
    THREE_SIDES: 'three-sides',
}

// showInputType переключает тип калькулятора.
function showInputType() {
    const inputType = document.getElementById("inputType").value;

    const imageSidesAngle = document.getElementById("imageSidesAngle");
    const imageThreeSides = document.getElementById("imageThreeSides");

    const inputsSidesAngle = document.getElementById("inputsSidesAngle");
    const inputsThreeSides = document.getElementById("inputsThreeSides");

    switch (String(inputType)) {
        case InputType.SIDES_ANGLE:
            imageSidesAngle.classList.remove('triangle-image--hidden');
            imageThreeSides.classList.add('triangle-image--hidden');
            inputsSidesAngle.classList.remove('calculator__section--hidden');
            inputsThreeSides.classList.add('calculator__section--hidden');
            break;
        case InputType.THREE_SIDES:
            imageSidesAngle.classList.add('triangle-image--hidden');
            imageThreeSides.classList.remove('triangle-image--hidden');
            inputsSidesAngle.classList.add('calculator__section--hidden');
            inputsThreeSides.classList.remove('calculator__section--hidden');
            break;
    }

    resetResultsAndErrors()
}

function clearInputs() {
    document.getElementById('sideA').value = '';
    document.getElementById('sideB').value = '';
    document.getElementById('angleGamma').value = '';
    document.getElementById('side3A').value = '';
    document.getElementById('side3B').value = '';
    document.getElementById('side3C').value = '';

    resetResultsAndErrors()
}

function resetResultsAndErrors() {
    document.getElementById('results').classList.remove('results--visible');
    hideGeneralError();
    clearAllInputErrors();
}

function showInputError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.add('input-field__input--error');
    error.textContent = message;
    error.classList.add('input-field__error--visible');
}

function hideInputError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.remove('input-field__input--error');
    error.classList.remove('input-field__error--visible');
}

function showGeneralError(message) {
    const error = document.getElementById('generalError');
    error.textContent = message;
    error.classList.add('error-box--visible');
}

function hideGeneralError() {
    const error = document.getElementById('generalError');
    error.textContent = '';
    error.classList.remove('error-box--visible');
}

function clearAllInputErrors() {
    const errorPairs = [
        ['sideA', 'sideAError'],
        ['sideB', 'sideBError'],
        ['angleGamma', 'angleGammaError'],
        ['side3A', 'side3AError'],
        ['side3B', 'side3BError'],
        ['side3C', 'side3CError'],
    ];

    errorPairs.forEach(([inputId, errorId]) => hideInputError(inputId, errorId));
}

function validateSidesAngle() {
    let isValid = true;

    const a = document.getElementById('sideA').value;
    const b = document.getElementById('sideB').value;
    const gamma = document.getElementById('angleGamma').value;

    if (a === '') {
        showError('sideA', 'sideAError', 'Введите значение');
        isValid = false;
    } else if (isNaN(parseFloat(a)) || parseFloat(a) <= 0) {
        showError('sideA', 'sideAError', 'Должно быть положительное число');
        isValid = false;
    }

    if (b === '') {
        showError('sideB', 'sideBError', 'Введите значение');
        isValid = false;
    } else if (isNaN(parseFloat(b)) || parseFloat(b) <= 0) {
        showError('sideB', 'sideBError', 'Должно быть положительное число');
        isValid = false;
    }

    if (gamma === '') {
        showError('angleGamma', 'angleGammaError', 'Введите значение');
        isValid = false;
    } else if (isNaN(parseFloat(gamma))) {
        showError('angleGamma', 'angleGammaError', 'Введите число');
        isValid = false;
    } else if (parseFloat(gamma) <= 0 || parseFloat(gamma) >= 180) {
        showError('angleGamma', 'angleGammaError', 'Угол должен быть от 0 до 180 градусов не включительно');
        isValid = false;
    }

    return isValid;
}

function validateThreeSides() {
    let isValid = true;

    const a = document.getElementById('side3A').value;
    const b = document.getElementById('side3B').value;
    const c = document.getElementById('side3C').value;

    if (a === '') {
        showError('side3A', 'side3AError', 'Введите значение');
        isValid = false;
    } else if (isNaN(parseFloat(a)) || parseFloat(a) <= 0) {
        showError('side3A', 'side3AError', 'Должно быть положительное число');
        isValid = false;
    }

    if (b === '') {
        showError('side3B', 'side3BError', 'Введите значение');
        isValid = false;
    } else if (isNaN(parseFloat(b)) || parseFloat(b) <= 0) {
        showError('side3B', 'side3BError', 'Должно быть положительное число');
        isValid = false;
    }

    if (c === '') {
        showError('side3C', 'side3CError', 'Введите значение');
        isValid = false;
    } else if (isNaN(parseFloat(c)) || parseFloat(c) <= 0) {
        showError('side3C', 'side3CError', 'Должно быть положительное число');
        isValid = false;
    }

    if (isValid) {
        const aVal = parseFloat(a);
        const bVal = parseFloat(b);
        const cVal = parseFloat(c);

        if (aVal + bVal <= cVal || aVal + cVal <= bVal || bVal + cVal <= aVal) {
            showGeneralError('Ошибка: стороны не удовлетворяют неравенству треугольника. Сумма любых двух сторон должна быть больше третьей.');
            isValid = false;
        }
    }

    return isValid;
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.add('input-field__input--error');
    error.textContent = message;
    error.classList.add('input-field__error--visible');
}

// calculateThirdSide вычисляет третью сторону треугольника по теореме косинусов.
function calculateThirdSide(a, b, gammaRad) {
    return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gammaRad));
}

// calculateAreaHeron вычисляет площадь треугольника по формуле Герона.
function calculateAreaHeron(a, b, c) {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

// calculateAreaSidesAngle вычисляет площадь по двум сторонам и углу между ними.
function calculateAreaSidesAngle(a, b, gammaRad) {
    return 0.5 * a * b * Math.sin(gammaRad);
}

// calculateHeights вычисляет высоты треугольника.
function calculateHeights(a, b, c, area) {
    return {
        ha: (2 * area) / a,
        hb: (2 * area) / b,
        hc: (2 * area) / c
    };
}

// calculateBisectors вычисляет биссектрисы.
function calculateBisectors(a, b, c) {
    const s = (a + b + c) / 2;
    return {
        la: (2 / (b + c)) * Math.sqrt(b * c * s * (s - a)),
        lb: (2 / (a + c)) * Math.sqrt(a * c * s * (s - b)),
        lc: (2 / (a + b)) * Math.sqrt(a * b * s * (s - c))
    };
}

// calculateCircumradius вычисляет радиус описанной окружности.
function calculateCircumradius(a, b, c, area) {
    return (a * b * c) / (4 * area);
}

// formatNumber форматирует число, оставляя 4 цифры после запятой.
function formatNumber(num) {
    return num.toFixed(4);
}

function calculate() {
    const inputType = document.getElementById('inputType').value;
    let a, b, c, area;

    switch (inputType) {
        case InputType.SIDES_ANGLE:
            clearAllInputErrors();
            hideGeneralError();

            if (!validateSidesAngle()) return;

            a = parseFloat(document.getElementById('sideA').value);
            b = parseFloat(document.getElementById('sideB').value);
            const gammaDeg = parseFloat(document.getElementById('angleGamma').value);
            const gammaRad = gammaDeg * Math.PI / 180;

            c = calculateThirdSide(a, b, gammaRad);
            area = calculateAreaSidesAngle(a, b, gammaRad);
            break;
        case InputType.THREE_SIDES:
            clearAllInputErrors();
            hideGeneralError();

            if (!validateThreeSides()) return;

            a = parseFloat(document.getElementById('side3A').value);
            b = parseFloat(document.getElementById('side3B').value);
            c = parseFloat(document.getElementById('side3C').value);
            area = calculateAreaHeron(a, b, c);
            break;
    }

    const calcBisectors = document.getElementById('calcBisectors').checked;
    const calcHeights = document.getElementById('calcHeights').checked;
    const calcRadius = document.getElementById('calcRadius').checked;
    const calcArea = document.getElementById('calcArea').checked;

    if (!calcBisectors && !calcHeights && !calcRadius && !calcArea) {
        showGeneralError('Выберите хотя бы одну характеристику для вычисления');
        return;
    }

    let resultsHTML = '';

    if (calcBisectors) {
        const bisectors = calculateBisectors(a, b, c);
        resultsHTML += `
                    <div class="result-item">
                        <span class="result-item__label">Биссектрисы:</span><br>
                        <span class="result-item__value">l<sub>a</sub> = ${formatNumber(bisectors.la)}</span><br>
                        <span class="result-item__value">l<sub>b</sub> = ${formatNumber(bisectors.lb)}</span><br>
                        <span class="result-item__value">l<sub>c</sub> = ${formatNumber(bisectors.lc)}</span>
                    </div>
                `;
    }

    if (calcHeights) {
        const heights = calculateHeights(a, b, c, area);
        resultsHTML += `
                    <div class="result-item">
                        <span class="result-item__label">Высоты:</span><br>
                        <span class="result-item__value">h<sub>a</sub> = ${formatNumber(heights.ha)}</span><br>
                        <span class="result-item__value">h<sub>b</sub> = ${formatNumber(heights.hb)}</span><br>
                        <span class="result-item__value">h<sub>c</sub> = ${formatNumber(heights.hc)}</span>
                    </div>
                `;
    }

    if (calcRadius) {
        const R = calculateCircumradius(a, b, c, area);
        resultsHTML += `
                    <div class="result-item">
                        <span class="result-item__label">Радиус описанной окружности:</span><br>
                        <span class="result-item__value">R = ${formatNumber(R)}</span>
                    </div>
                `;
    }

    if (calcArea) {
        resultsHTML += `
                    <div class="result-item">
                        <span class="result-item__label">Площадь:</span><br>
                        <span class="result-item__value">S = ${formatNumber(area)}</span>
                    </div>
                `;
    }

    document.getElementById('resultsContent').innerHTML = resultsHTML;
    document.getElementById('results').classList.add('results--visible');
}