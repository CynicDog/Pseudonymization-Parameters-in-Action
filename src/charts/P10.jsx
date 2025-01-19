import {useEffect, useRef, useState} from "react";
import {useParameter} from "../Context.jsx";
import * as d3 from "d3";

const P10 = ({data}) => {
    const {focusedParam, setFocusedParam} = useParameter();
    const svgRef = useRef(null);

    // Default binning value and threshold for outliers
    const binningValue = focusedParam.value || 6000;

    const [isSorted, setIsSorted] = useState(false); // Sort state
    const [threshold, setThreshold] = useState(null);

    useEffect(() => {
        if (!binningValue || binningValue === 0) return;

        const incomeData = data.data;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const margin = {top: 10, right: 30, bottom: 65, left: 40};
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([d3.min(incomeData) - 100, d3.max(incomeData) + 100])
            .range([0, width]);

        const bins = d3.bin()
            .thresholds(x.ticks(Math.ceil(d3.max(incomeData) / binningValue)))
            (incomeData);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0]);

        // Append axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .style("text-anchor", "middle")
            .text(`(binning size of ${binningValue})`);

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", 35)
            .attr("y", 15)
            .style("font-size", "20px")
            .style("font-weight", "lighter")
            .text(`파라미터 값: ${threshold !== null ? threshold : 0}`);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Count");

        // Add bars
        svg.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.x0) + 1)
            .attr("y", d => y(d.length))
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", d => height - y(d.length))
            .style("fill", d => threshold !== null && d.length <= threshold ? "#D55E00" : "#0072B2")
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                setThreshold(d.length); // Set threshold to the clicked bin's count
            });
    }, [data, binningValue, threshold]);

    // Update binning parameter
    const handleBinningChange = (event) => {
        const newBinningValue = parseInt(event.target.value, 10);
        setFocusedParam({
            ...focusedParam,
            value: newBinningValue,
        });
    };

    return (
        <div>
            <div style={{marginTop: "70px"}}>
                <svg ref={svgRef} width="100%" height="400" viewBox="0 0 760 400"></svg>
            </div>

            <div className="d-flex">
                <div className="ms-auto" style={{width: "45%"}}>
                    <div className="d-flex align-content-center mt-3">
                        <div className="form-check mx-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                                checked={isSorted}
                                onChange={() => setIsSorted((prev) => !prev)}
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                <p className="fw-lighter">정렬</p>
                            </label>
                        </div>
                        <p className="fw-lighter me-2">카운트구간길이 조정</p>
                        <div className="mb-2">
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
    );
};

export default P10;
