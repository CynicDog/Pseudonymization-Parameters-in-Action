import { useParameter } from "./Context";
import EmptyChart from "./charts/EmptyChart.jsx";
import incomes from "../data/incomes.json";

const Chart = () => {

    const { focusedParam } = useParameter();

    const paramToChartMap = {
        "P1": <EmptyChart parameter_name={focusedParam.name} />,
        "P2": <EmptyChart parameter_name={focusedParam.name} />,
        "P3": <EmptyChart parameter_name={focusedParam.name} />,
        "P4": <EmptyChart parameter_name={focusedParam.name} />,
        "P5": <EmptyChart parameter_name={focusedParam.name} />,
        "P6": <EmptyChart parameter_name={focusedParam.name} />,
        "P7": <EmptyChart parameter_name={focusedParam.name} />,
        "P8": <EmptyChart parameter_name={focusedParam.name} />,
        "P9": <EmptyChart parameter_name={focusedParam.name} />,
        "P10": <EmptyChart parameter_name={focusedParam.name} />,
        "P11": <EmptyChart parameter_name={focusedParam.name} />,
        "P12": <EmptyChart parameter_name={focusedParam.name} />,
        "P13": <EmptyChart parameter_name={focusedParam.name} data={incomes} />,
    };

    return (
        <>
            <h5>Chart - {focusedParam.id}</h5>
            <div>{paramToChartMap[focusedParam.id]}</div>
        </>
    );
};

export default Chart;
