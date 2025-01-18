// App.jsx
import {useParameter} from "./Context";
import parameters from "../data/parameters.json";
import ChartControl from "./ChartControl.jsx";

const App = () => {
    const {focusedParam, setFocusedParam} = useParameter();

    return (
        <div className="container">
            <div className="row">
                {/* Side Section */}
                <div className="col-3 mt-5">
                    <div className="border rounded-3 shadow p-3">
                        <h3>Parameters</h3>
                        <div>
                            {parameters.data.map((param, index) => (
                                <div
                                    key={index}
                                    className={`${
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
                        <h3>Description</h3>
                        <div className="p-4">
                            {focusedParam ? (
                                <>
                                    <div className="d-flex mb-2">
                                        <strong>파라미터:</strong>
                                        <span className="fw-lighter ms-2">{focusedParam.name}</span>
                                    </div>
                                    <div className="d-flex">
                                        <strong>설명:</strong>
                                        <span className="fw-lighter ms-2">{focusedParam.description}</span>
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
};

export default App;
