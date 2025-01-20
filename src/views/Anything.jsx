import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Example1 = ({ data }) => {
    const svgRef = useRef(null);

    const [binningValue, setBinningValue] = useState(6000);
    const [threshold, setThreshold] = useState(null);
    const [standard, setStandard] = useState("frequency"); // 'frequency' or 'percentage'
    const [focusedBinFrequencyYPosition, setFocusedBinFrequencyYPosition] = useState(null);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (!binningValue || binningValue === 0) return;

        const incomeData = data.data;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const margin = { top: 10, right: 10, bottom: 65, left: 40 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;

        const totalDataFrequency = incomeData.length;

        const x = d3
            .scaleLinear()
            .domain([d3.min(incomeData), d3.max(incomeData)])
            .range([0, width]);

        const bins = d3
            .bin()
            .thresholds(x.ticks(Math.ceil(d3.max(incomeData) / binningValue)))(incomeData);

        const yMax =
            standard === "frequency"
                ? d3.max(bins, (d) => d.length)
                : d3.max(bins, (d) => (d.length / totalDataFrequency) * 100);

        const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

        // Populate table data
        const newTableData = bins.map((bin) => {
            const frequency = bin.length;
            const percentage = ((frequency / totalDataFrequency) * 100).toFixed(2);
            const valueRange = `${bin.x0}-${bin.x1}`;
            return { valueRange, frequency, percentage };
        });

        setTableData(newTableData.sort((a, b) => b.frequency - a.frequency));

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

        const yAxis = svg.append("g").call(
            d3.axisLeft(y).ticks(5).tickFormat((d) => (standard === "percentage" ? `${d}%` : d))
        );

        svg
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .style("text-anchor", "middle")
            .text("Income");

        svg
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 65)
            .style("text-anchor", "middle")
            .style("font-weight", "lighter")
            .text(`(binning size of ${binningValue})`);

        svg
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", 35)
            .attr("y", 22)
            .style("font-size", "22px")
            .style("font-weight", "lighter")
            .text(
                `Threshold: ${
                    threshold !== null
                        ? standard === "percentage"
                            ? threshold.toFixed(4)
                            : threshold
                        : 0
                }`
            );

        svg
            .selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("y", (d) =>
                y(standard === "frequency" ? d.length : (d.length / totalDataFrequency) * 100)
            )
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", (d) =>
                height - y(standard === "frequency" ? d.length : (d.length / totalDataFrequency) * 100)
            )
            .style("fill", (d) =>
                threshold !== null &&
                (standard === "frequency" ? d.length : (d.length / totalDataFrequency) * 100) <= threshold
                    ? "#D55E00" // Orange for outliers
                    : "#0072B2" // Blue for normal bins
            )
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                setThreshold(
                    standard === "frequency" ? d.length : (d.length / totalDataFrequency) * 100
                );
            })
            .on("mouseenter", function (event, d) {
                setFocusedBinFrequencyYPosition(
                    y(standard === "frequency" ? d.length : (d.length / totalDataFrequency) * 100)
                );
            })
            .on("mouseleave", () => {
                setFocusedBinFrequencyYPosition(null);
            });

        yAxis
            .selectAll(".tick")
            .on("mouseenter", function (event, d) {
                setFocusedBinFrequencyYPosition(y(d));
            })
            .on("mouseleave", function () {
                setFocusedBinFrequencyYPosition(null);
            })
            .on("click", function (event, d) {
                setThreshold(d);
            })
            .style("cursor", "pointer")
            .style("font-size", "14px");
    }, [data, binningValue, threshold, standard]);

    const handleBinningChange = (event) => {
        setBinningValue(parseInt(event.target.value, 10));
        setThreshold(0);
    };

    const handleStandardChange = (event) => {
        setStandard(event.target.value);
        setThreshold(null);
    };

    return (
        <div className="container">
            <div className="row">
                {/* Frequency Histogram */}
                <div className="col-9">
                    <div>
                        <select
                            value={standard}
                            onChange={handleStandardChange}
                            style={{
                                height: "30px",
                                width: "120px",
                                marginBottom: "10px",
                                fontSize: "14px",
                                padding: "5px",
                            }}
                        >
                            <option value="frequency">Frequency</option>
                            <option value="percentage">Percentage</option>
                        </select>
                    </div>
                    <svg ref={svgRef} width="100%" height="330" viewBox="0 0 760 330"></svg>
                    <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="1000"
                        value={binningValue}
                        onChange={handleBinningChange}
                        style={{ width: "100%", marginTop: "10px" }}
                    />
                </div>

                {/* Frequency Table */}
                <div className="col-3" style={{ overflowY: "scroll", maxHeight: "400px" }}>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Value</th>
                            <th>Frequency</th>
                            <th>Percentage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.valueRange}</td>
                                <td>{row.frequency}</td>
                                <td>{row.percentage}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Example1;
