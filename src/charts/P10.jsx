import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const P10 = ({ data }) => {
    const svgRef = useRef(null);

    // Default binning value and threshold for outliers
    const binningValue = 1000;
    const [threshold, setThreshold] = useState(null);
    const [focusedBinFrequencyYPosition, setFocusedBinFrequencyYPosition] = useState(null);

    useEffect(() => {
        if (!binningValue || binningValue === 0) return;

        const incomeData = data.data;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart

        const margin = { top: 10, right: 30, bottom: 65, left: 40 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([d3.min(incomeData) - 100, d3.max(incomeData) + 100])
            .range([0, width]);

        const bins = d3.bin()
            .thresholds(x.ticks(Math.ceil(d3.max(incomeData) / binningValue)))(incomeData);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, (d) => d.length)])
            .range([height, 0]);

        let tickValues = x.ticks();
        if (tickValues[0] > 10000) {
            tickValues = [10000, ...tickValues];
        }
        svg.append("g")
            .attr("transform", `translate(0 ,${height})`)
            .call(d3.axisBottom(x).tickValues(tickValues));

        const yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        // x-axis label
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .style("text-anchor", "middle")
            .text("Income");

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 65)
            .style("text-anchor", "middle")
            .style("font-weight", "lighter")
            .text(`(binning size of ${binningValue})`);

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", 35)
            .attr("y", 22)
            .style("font-size", "22px")
            .style("font-weight", "lighter")
            .text(`파라미터 값: ${threshold !== null ? threshold : 0}`);

        // Conditionally add the text when threshold is null
        if (threshold === null || threshold === 0) {
            svg.append('text')
                .attr("x", 35)
                .attr('y', 55)
                .attr('dy', -10)
                .attr('text-anchor', 'start')
                .style('font-size', '15px')
                .style('font-weight', 'lighter')
                .text('파라미터 값을 설정하려면 히스토그램의 막대 또는 y축의 눈금값을 클릭하세요.');
        }

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(bins)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("y", (d) => y(d.length))
            .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", (d) => height - y(d.length))
            .style("fill", (d) => (threshold !== null && d.length <= threshold ? "#D55E00" : "#0072B2"))
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                setThreshold(d.length); // Set threshold when clicking on a bar
            })
            .on("mouseenter", function (event, d) {
                setFocusedBinFrequencyYPosition(y(d.length));
            })
            .on("mouseleave", () => {
                setFocusedBinFrequencyYPosition(null);
            });

        // Add event listener for mouseenter and click on y-axis ticks
        yAxis.selectAll(".tick")
            .on("mouseenter", function (event, d) {
                // On mouse enter, display the dashed line at the tick position
                setFocusedBinFrequencyYPosition(y(d)); // Set the position based on the tick
            })
            .on("mouseleave", function () {
                // On mouse leave, remove the dashed line
                setFocusedBinFrequencyYPosition(null);
            })
            .on("click", function (event, d) {
                // On click, set the threshold to the y value of the clicked tick
                setThreshold(d);
            })
            .style("cursor", "pointer") // Change cursor to pointer when hovering over the tick
            .style("font-size", "14px"); // Set font size for ticks

        // Add dashed line for focusedBinFrequencyYPosition if it is not null
        if (focusedBinFrequencyYPosition !== null) {
            svg.selectAll(".dashed-line").remove(); // Remove any existing dashed line
            svg.append("line")
                .attr("class", "dashed-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", focusedBinFrequencyYPosition)
                .attr("y2", focusedBinFrequencyYPosition)
                .attr("stroke", "gray")
                .attr("stroke-dasharray", "5,7");
        }
    }, [data, binningValue, threshold, focusedBinFrequencyYPosition]);
    return (
        <div>
            <div style={{ marginTop: "70px" }}>
                <svg ref={svgRef} width="100%" height="400" viewBox="0 0 760 400"></svg>
            </div>
        </div>
    );
};

export default P10;
