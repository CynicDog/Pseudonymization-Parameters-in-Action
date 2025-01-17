import {useParameter} from "../Context.jsx";

const EmptyChart = ({ data }) => {

    const { focusedParam } = useParameter();

    return (
        <>
            To Be Implemented .. {focusedParam.name}, with data of { data? data.data.length : 0 }
        </>
    );
};

export default EmptyChart;
