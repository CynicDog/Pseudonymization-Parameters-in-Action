import { useParameter } from "./Context";
import EmptyChart from "./charts/EmptyChart.jsx";
import incomes from "../data/incomes.json";
import Histogram from "./charts/Histogram.jsx";

const ChartControl = () => {

    const { focusedParam } = useParameter();

    const paramToChartMap = {
        "P1": <EmptyChart data={ null } />,
        "P2": <EmptyChart data={ null } />,
        "P3": <EmptyChart data={ null } />,
        "P4": <EmptyChart data={ null } />,
        "P5": <EmptyChart data={ null } />,
        "P6": <EmptyChart data={ null } />,
        "P7": <EmptyChart data={ null } />,
        "P8": <EmptyChart data={ null } />,
        "P9": <EmptyChart data={ null } />,
        "P10": <EmptyChart data={ null } />,
        "P11": <EmptyChart data={ null } />,
        "P12": <EmptyChart data={ null } />,
        "P13": <Histogram data={incomes} />,
    };

    return (
        <>
            <div>{paramToChartMap[focusedParam.id]}</div>
        </>
    );
};

export default ChartControl;
