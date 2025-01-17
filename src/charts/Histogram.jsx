import { useEffect, useState, useRef } from "react";
import { useParameter } from "../Context.jsx";
import * as d3 from "d3";

// TODO:
//      1. Error: Invalid negative value for <rect> attribute width="-1"
//      2. Add comments

const Histogram = ({ data }) => {
    const { focusedParam, setFocusedParam } = useParameter();
    const svgRef = useRef(null);

    const binningValue = focusedParam.value || 10000;

    useEffect(() => {
        if (!binningValue || binningValue === 0) return;

        const incomeData = data.data || data;

        const margin = { top: 10, right: 30, bottom: 45, left: 40 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain([0, d3.max(incomeData)])
            .range([0, width]);

        const histogram = d3.histogram()
            .value(d => d)
            .domain(x.domain())
            .thresholds(x.ticks(Math.ceil(d3.max(incomeData) / binningValue)));

        const bins = histogram(incomeData);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(bins, d => d.length)]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "14px")
            .style("font-weight", "bold");

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .style("text-anchor", "middle")
            .text("Income");

        svg.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.x0) + 1)
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => height - y(d.length))
            .style("fill", "#C8102E");

    }, [data, binningValue]);

    const handleBinningChange = (event) => {
        const newBinningValue = parseInt(event.target.value, 10);
        setFocusedParam({
            ...focusedParam,
            value: newBinningValue,
        });
    };

    return (
        <div>
            <div className="d-flex py-3">
                <div className="ms-auto" style={{width: "30%"}}>
                    <div>
                        <p><strong>{focusedParam.name}</strong>: <u>{binningValue}</u></p>
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

            <svg ref={svgRef} width="100%" height="400" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
    );
};

export default Histogram;
