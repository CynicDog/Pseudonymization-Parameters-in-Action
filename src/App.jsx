// App.jsx
import { useParameter } from "./Context";
import parameters from "../data/parameters.json";
import ChartControl from "./ChartControl.jsx";

const App = () => {
    const { focusedParam, setFocusedParam } = useParameter();

    return (
        <div className="container" style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 0
        }}>
            <div className="row">
                {/* Side Section */}
                <div className="col-3">
                    <h3>Parameters</h3>
                    <ul className="list-group">
                        {parameters.data.map((param, index) => (
                            <div
                                key={index}
                                className={`list-group-item ${
                                    focusedParam?.id === param.parameter_id ? "active" : ""
                                }`}
                                onClick={() =>
                                    setFocusedParam({
                                        id: param.parameter_id,
                                        name: param.parameter_name,
                                        value: null
                                    })
                                }
                                style={{ cursor: "pointer" }}
                            >
                                {param.parameter_name}
                            </div>
                        ))}
                    </ul>
                </div>

                {/* Main Section */}
                <div className="col-9">
                    <h3>Description</h3>
                    <div className="border p-4">
                        {focusedParam ? (
                            <>
                                <p>
                                    <strong>파라미터:</strong> {focusedParam.name}
                                    <br />
                                    <strong>설명:</strong>{" "}
                                    {
                                        parameters.data.find(
                                            (param) => param.parameter_id === focusedParam.id
                                        )?.description
                                    }
                                </p>
                                <ChartControl parameter={focusedParam} />
                            </>
                        ) : (
                            <p>Please select a parameter from the list.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
