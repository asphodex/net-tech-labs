const getMaxOfMins = function (...strings) {
    const mins = strings.map(function (str) {
        const numbers = str.split(" ")
            .map(Number)
            .filter(function (n) {
                return !isNaN(n);
            });

        return numbers.reduce(function (min, n) {
            return n < min ? n : min;
        })
    })

    return mins.reduce(function (max, n) {
        return n > max ? n : max;
    })
}

console.log(getMaxOfMins("12 2 1", "f asd 23 fs23 1", "16 54 5"))