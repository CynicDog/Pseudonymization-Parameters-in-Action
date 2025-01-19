import { useParameter } from "./Context";
import EmptyChart from "./charts/EmptyChart.jsx";
import incomes from "../data/incomes.json";
import ages from "../data/ages.json";
import people from "../data/people.json";

import P13 from "./charts/P13.jsx";
import P12 from "./charts/P12.jsx";
import P7 from "./charts/P7.jsx";
import P8 from "./charts/P8.jsx";
import P10 from "./charts/P10.jsx";

const ChartControl = () => {

    const { focusedParam } = useParameter();

    const paramToChartMap = {
        "P1": <EmptyChart data={ null } />,
        "P2": <EmptyChart data={ null } />,
        "P3": <EmptyChart data={ null } />,
        "P4": <EmptyChart data={ null } />,
        "P5": <EmptyChart data={ null } />,
        "P6": <EmptyChart data={ null } />,
        "P7": <P7 data={ people } />,
        "P8": <P8 data={ people } />,
        "P9": <EmptyChart data={ null } />,
        "P10": <P10 data={ incomes } />,
        "P11": <EmptyChart data={ null } />,
        "P12": <P12 data={ ages } />,
        "P13": <P13 data={ incomes } />,
    };

    return (
        <>
            <div>{paramToChartMap[focusedParam.id]}</div>
        </>
    );
};

export default ChartControl;
