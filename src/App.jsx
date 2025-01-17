import { useState } from "react";
import parameters from "../data/parameters.json";

function App() {
    const [selectedParam, setSelectedParam] = useState(null);

    return (
        <div className="container" style={{ marginTop: "10%" }}>
            <div className="row">
                {/* Side Section */}
                <div className="col-lg-3">
                    <h3>Parameters</h3>
                    <ul className="list-group">
                        {parameters.data.map((param, index) => (
                            <div
                                key={index}
                                className={`list-group-item ${
                                    selectedParam === param.parameter_name ? "active" : ""
                                }`}
                                onClick={() => setSelectedParam(param.parameter_name)}
                                style={{ cursor: "pointer" }}
                            >
                                {param.parameter_name}
                            </div>
                        ))}
                    </ul>
                </div>

                {/* Main Section */}
                <div className="col-lg-9">
                    <h3>Description</h3>
                    <div className="border p-4">
                        {selectedParam ? (
                            <p>
                                <strong>파라미터:</strong> {selectedParam}
                                <br />
                                <strong>설명:</strong>{" "}
                                {
                                    parameters.data.find(
                                        (param) => param.parameter_name === selectedParam
                                    )?.description
                                }
                            </p>
                        ) : (
                            <p>Please select a parameter from the list.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
