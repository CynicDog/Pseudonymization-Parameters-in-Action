import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

const Example1 = ({data}) => {
    const svgRef = useRef(null);
    const tableBodyRef = useRef(null);

    const [binningValue, setBinningValue] = useState(1000);

    const [standard, setStandard] = useState("frequency");

    const [threshold, setThreshold] = useState(null);
    const [focusedBinFrequencyYPosition, setFocusedBinFrequencyYPosition] = useState(null);

    const [tableData, setTableData] = useState([]);
    const [focusedTableRow, setFocusedTableRow] = useState(null);

    useEffect(() => {
        if (!binningValue || binningValue === 0) return;

        const incomeData = data.data;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const margin = {top: 10, right: 10, bottom: 65, left: 40};
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

        setFocusedTableRow(null);

        const newTableData = bins
            .map((bin) => {
                const frequency = bin.length;
                const percentage = ((frequency / totalDataFrequency) * 100);
                const valueRange = `${bin.x0}-${bin.x1}`;
                return {valueRange, frequency, percentage};
            })
            // Exclude zero-frequency bins
            .filter((row) => row.frequency > 0)
            // De-duplicate entries of the same frequencies
            .reduce((unique, item) => {
                const exists = unique.some(
                    (u) => u.frequency === item.frequency && u.percentage === item.percentage
                );
                if (!exists) unique.push(item);
                return unique;
            }, []);

        setTableData(newTableData.sort((a, b) => a.frequency - b.frequency));

        const yMax =
            standard === "frequency"
                ? d3.max(bins, (d) => d.length)
                : d3.max(bins, (d) => (d.length / totalDataFrequency) * 100);

        const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

        if (focusedTableRow) {
            setFocusedBinFrequencyYPosition(
                y(standard === "frequency" ? focusedTableRow.frequency : focusedTableRow.percentage)
            );

            const newThreshold = standard === "frequency" ? focusedTableRow.frequency : parseFloat(focusedTableRow.percentage);
            setThreshold(newThreshold);
        }

        let tickValues = x.ticks();
        if (tickValues[0] > 10000) {
            tickValues = [10000, ...tickValues];
        }
        svg.append("g")
            .attr("transform", `translate(0 ,${height})`)
            .call(d3.axisBottom(x).tickValues(tickValues));

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
                `임계값: ${
                    threshold !== null
                        ? standard === "percentage"
                            ? threshold.toFixed(4)
                            : threshold
                        : 0
                }`
            );

        if (threshold === null || threshold === 0) {
            svg
                .append("text")
                .attr("x", 35)
                .attr("y", 55)
                .attr("dy", -10)
                .attr("text-anchor", "start")
                .style("font-size", "15px")
                .style("font-weight", "lighter")
                .text("임계값을 설정하려면 히스토그램의 막대 또는 y축의 눈금값을 클릭하세요.");
        }

        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(standard === "frequency" ? "Frequency" : "Percentage");

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

        if (focusedBinFrequencyYPosition !== null) {
            svg.selectAll(".dashed-line").remove();
            svg
                .append("line")
                .attr("class", "dashed-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", focusedBinFrequencyYPosition)
                .attr("y2", focusedBinFrequencyYPosition)
                .attr("stroke", "gray")
                .attr("stroke-dasharray", "5,7");
        } else {
            svg.selectAll(".dashed-line").remove();
        }
    }, [data, binningValue, threshold, standard, focusedBinFrequencyYPosition, focusedTableRow]);

    useEffect(() => {
        if (tableBodyRef.current) {
            const rows = tableBodyRef.current.querySelectorAll("tr");
            const firstColoredRow = Array.from(rows).findLast(
                (row) => row.classList.contains("table-warning")
            );
            if (firstColoredRow) {
                firstColoredRow.scrollIntoView({behavior: "smooth", block: "start"});
            }
        }
    }, [threshold, standard]); // Scroll when threshold or standard changes

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
            <div className="border rounded-3 shadow m-4 p-4">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-center my-3">
                            <span className="fs-3 fw-light">소득</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="ps-5">
                            <span className="fs-5 fw-lighter">가명화 규칙: <strong>이상치범주화</strong></span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* Frequency Histogram */}
                    <div className="col-9">
                        <div className="d-flex mt-3">
                            <div className="ms-auto" style={{width: "30%"}}>
                                <div className="d-flex">
                                    <p className="fs-5 fw-lighter me-3">임계기준</p>
                                    <select
                                        className="form-select form-select-sm"
                                        value={standard}
                                        onChange={handleStandardChange}
                                        style={{height: "30px", width: "120px"}}
                                    >
                                        <option value="frequency">건수</option>
                                        <option value="percentage">비율</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop: "30px", width: "100%"}}>
                            <svg ref={svgRef} width="100%" height="400" viewBox="0 0 750 400"></svg>
                        </div>
                        <div className="d-flex">
                            <div className="ms-auto" style={{width: "30%"}}>
                                <div className="d-flex align-content-center">
                                    <p className="fw-lighter me-2">카운트구간길이 조정</p>
                                    <div>
                                        <input
                                            type="range"
                                            className="form-range"
                                            id="input-range"
                                            min="1000"
                                            max="20000"
                                            step="1000"
                                            value={binningValue}
                                            onChange={handleBinningChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Frequency Table */}
                    <div className="col-3 border rounded-3 shadow-sm p-3">
                        {/* Table Header */}
                        <div className="row">
                            <div className="col-4">
                                <strong>Frequency</strong>
                            </div>
                            <div className="col-8">
                                <strong>Percentage</strong>
                            </div>
                        </div>

                        {/* Scrollable Table Body */}
                        <div
                            className="table-body"
                            style={{
                                maxHeight: "450px",
                                overflowY: "auto",
                                marginTop: "8px",
                                paddingTop: "8px",
                                borderTop: "1px solid #ddd",
                            }}
                            ref={tableBodyRef}
                        >
                            <table
                                className="table table-sm"
                                style={{width: "100%", borderCollapse: "collapse", marginBottom: 0}}
                            >
                                <tbody>
                                {tableData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            standard === "percentage"
                                                ? row.percentage <= threshold
                                                    ? "table-warning"
                                                    : "table-primary"
                                                : row.frequency <= threshold
                                                    ? "table-warning"
                                                    : "table-primary"
                                        }
                                        onClick={() => setFocusedTableRow(row)}
                                    >
                                        <td style={{padding: "10px", fontSize: "14px"}}>{row.frequency}</td>
                                        <td style={{
                                            padding: "8px",
                                            fontSize: "14px"
                                        }}>{parseFloat(row.percentage).toFixed(4)}%
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col px-5 py-3">
                        <div className="d-flex justify-content-center align-items-center mt-4">
                            소득 데이터를 파라미터 (
                            {standard !== null && (
                                <>
                                    <span className="badge text-bg-primary rounded-pill me-1 text-center">임계기준</span>
                                    <span
                                        className="badge text-bg-secondary rounded-pill me-3 text-center">{standard}</span>
                                </>
                            )}
                            {threshold !== null && (
                                <>
                                    <span className="badge text-bg-primary rounded-pill me-1 text-center">임계값</span>
                                    <span
                                        className="badge text-bg-secondary rounded-pill me-3 text-center">{threshold}</span>
                                </>
                            )}
                            {binningValue !== null && (
                                <>
                                    <span className="badge text-bg-primary rounded-pill me-1 text-center">카운트구간길이</span>
                                    <span
                                        className="badge text-bg-secondary rounded-pill text-center">{binningValue}</span>
                                </>
                            )}
                            ) 를 활용하여 이상치 범주화를 적용합니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Example1;
