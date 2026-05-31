function CreateRange({ firstValue, step }) {
    const start = Number(firstValue);
    const diff = Number(step);

    const [numbers, setNumbers] = useState([start]);

    const addNextNumber = () => {
        setNumbers((prev) => {
            const last = prev[prev.length - 1];
            return [...prev, last + diff];
        });
    };

    return (
        <div className="text-lg font-mono p-4">
            {numbers.join(" ")}{" "}
            <span
                onClick={addNextNumber}
                className="cursor-pointer text-blue-600 hover:underline"
            >
        ...
      </span>
        </div>
    );
}