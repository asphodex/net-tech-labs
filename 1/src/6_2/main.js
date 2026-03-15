const encryptedText = "БВОМЙУ_УОПЗЛ_ЧМТОЖНЬУО_ОШОИНСКАССНА_ТИТ_ЮТ_БПВО_СЛВООЮЫТВАИЕ_ДЕО";

const rotationsCount = 4;
const squareSize = 8;

const grilles = [
    // 1
    [
        [1, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 1],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 1, 0]
    ],

    // 2
    [
        [0, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1]
    ],

    // 3
    [
        [1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1],
        [0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0]
    ],

    // 4
    [
        [0, 0, 0, 1, 1, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 1, 0, 1, 1, 1],
        [0, 0, 1, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0]
    ],

    // 5
    [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 1, 0, 1]
    ],

    // 6
    [
        [1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 1, 1],
        [0, 0, 1, 0, 0, 1, 1, 0]
    ]
];


// rotateMatrixClockwise возвращает копию повернутой
// по часовой стрелке на 90 градусов матрицы.
function rotateMatrixClockwise(matrix) {
    // матрица размерностью m x n станет n x m

    if (matrix === null || matrix.length === 0) {
        return null;
    }

    // строка
    const m = matrix[0].length;

    // столбец
    const n = matrix.length;

    // создаем новую пустую матрицу
    const rotated = Array.from({length: m}, () => new Array(n));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // в новой матрице меняем i и j
            rotated[j][n - i - 1] = matrix[i][j];
        }
    }

    return rotated;
}

function blockToSquare(block) {
    const square = [];

    for (let i = 0; i < squareSize; i++) {
        square[i] = [];
        for (let j = 0; j < squareSize; j++) {
            // двигаемся по строкам учитывая длину 8
            // если блок закончился раньше, заполняем '_'
            square[i][j] = block[i * 8 + j] || '_';
        }
    }

    return square;
}

// decryptBlock расшифровывает один блок с длиной 64 символа с данной решёткой
function decryptBlock(block, matrix) {
    // блок в квадрат 8x8
    const square = blockToSquare(block)

    let result = '';
    let currentMatrix = matrix;

    // 4 поворота
    for (let rotation = 0; rotation < rotationsCount; rotation++) {
        // читаем буквы через отверстия
        for (let i = 0; i < squareSize; i++) {
            for (let j = 0; j < squareSize; j++) {

                // отверстие есть, читаем!
                if (currentMatrix[i][j] === 1) {
                    result += square[i][j];
                }

            }
        }

        // поворачиваем решётку
        currentMatrix = rotateMatrixClockwise(currentMatrix);
    }

    return result;
}

// decrypt принимает на вход текст и матрицу-решетку,
// возвращает расшифрованную строку.
function decrypt(text, matrix) {
    // разбиваем на блоки по 64 символа
    const blocks = [];
    for (let i = 0; i < text.length; i += 64) {
        // 0-63 включительно, затем 0+64: 64-127 включительно
        blocks.push(text.slice(i, i + 64));
    }

    let result = '';
    for (const block of blocks) {
        result += decryptBlock(block, matrix);
    }

    return result;
}


console.log("Зашифрованный текст:", encryptedText);
console.log("Длина:", encryptedText.length);
console.log();

for (let i = 0; i < grilles.length; i++) {
    const decrypted = decrypt(encryptedText, grilles[i]);
    console.log(`Решетка ${i + 1}: ${decrypted}`);
}