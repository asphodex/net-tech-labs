/*
    компонент, для вывода строки таблицы
    пропсы:
        row - данные для формирования ячеек строки таблицы в виде массива
*/
const TableRow = (props) => {
    const cells = (props.isHead === "0")
        ? props.row.map((item, index) => <td key={index} className={"table-row"}> { item } </td>)
        : props.row.map((item, index) => <th key={index} className={"table-header"}> { item } </th>);
    
    return(< >{cells}</>)
}

export default TableRow;
