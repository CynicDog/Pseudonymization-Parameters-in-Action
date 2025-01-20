import {useParameter} from "../Context.jsx";
import ChartControl from "../ChartControl.jsx";
import parameters from "../../data/parameters.json";

const Description = () => {

    const {focusedParam, setFocusedParam} = useParameter();

    // Sort the parameters by the order value
    const sortedParameters = parameters.data.sort((a, b) => a.order - b.order);

    return (
        <div className="container">
            <div className="row">
                {/* Side Section */}
                <div className="col-3 mt-5">
                    <div className="border rounded-3 shadow p-3">
                        <span className="fs-2 fw-lighter">Parameters</span>
                        <div>
                            {sortedParameters.map((param, index) => (
                                <div
                                    key={index}
                                    className={`my-1 ${
                                        focusedParam?.id === param.parameter_id ? "fw-bold rounded-3 bg-primary-subtle px-1" : "fw-lighter"
                                    }`}
                                    onClick={() =>
                                        setFocusedParam({
                                            id: param.parameter_id,
                                            name: param.parameter_name,
                                            value: null,
                                            description: param.description
                                        })
                                    }
                                    style={{cursor: "pointer"}}
                                >
                                    {param.parameter_name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Main Section */}
                <div className="col-9 mt-5">
                    <div className="border rounded-3 shadow p-3">
                        <span className="fs-2 fw-lighter">Parameter Description</span>
                        <div className="p-4">
                            {focusedParam ? (
                                <>
                                    <div className="fw-lighter d-flex align-items-end my-2">
                                        <span className="fs-4 px-3 ms-2">{focusedParam.name}</span>
                                        <span className="ms-2">{focusedParam.description}</span>
                                    </div>
                                    <ChartControl parameter={focusedParam}/>
                                </>
                            ) : (
                                <p>Please select a parameter from the list.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Description;