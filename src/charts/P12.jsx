import {useEffect, useState, useRef} from "react";
import * as d3 from "d3";

const P12 = ({data}) => {
    const [mRoundingValue, setMRoundingValue] = useState(9); // 데이터구간 초기값
    const [isSorted, setIsSorted] = useState(false); // Sort state
    const rawSvgRef = useRef(null); // 원본 데이터 SVG 참조
    const transformedSvgRef = useRef(null); // 변환된 데이터 SVG 참조

    useEffect(() => {
        let rawData = data.data;

        // MROUND 함수
        const applyRounding = (value, interval) => {
            return Math.round(value / interval) * interval; // 데이터를 구간에 맞게 반올림
        };

        // 데이터 변환
        let transformedData = rawData.map((d) => applyRounding(d, mRoundingValue));

        // 정렬된 데이터 (Descending)
        if (isSorted) {
            // 내림차순 정렬
            transformedData = transformedData.slice().sort((a, b) => a - b);
            rawData = rawData.slice().sort((a, b) => a - b);
        }

        // 공통 히스토그램 렌더링 함수
        const renderHistogram = (svgRef, inputData, title, isTransformed) => {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // 기존에 그려진 그래프 초기화

            const margin = {top: 20, right: 15, bottom: 45, left: 50}; // 여백 설정
            const width = svgRef.current.clientWidth - margin.left - margin.right; // 너비 계산
            const height = svgRef.current.clientHeight - margin.top - margin.bottom; // 높이 계산

            // x축 스케일
            const x = d3.scaleBand()
                .domain(d3.range(inputData.length))
                .range([50, width])
                .padding(0.3);

            // y축 스케일
            const minYValue = d3.min(inputData);
            const maxYValue = d3.max(inputData);
            const y = d3.scaleLinear()
                .domain([0, maxYValue])
                .range([height, 10]);

            let tickValues = [];
            if (isTransformed) {
                for (let i = minYValue; i <= maxYValue; i += mRoundingValue) {
                    tickValues.push(i);
                }
            } else {
                for (let i = 10; i <= maxYValue; i += 10) {
                    tickValues.push(i);
                }
            }

            // x축 생성 및 그리기
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(() => "").tickSize(0));

            // y축 생성 및 그리기
            svg.append("g")
                .attr("transform", "translate(50,0)")
                .style("font-size", "14px")
                .call(d3.axisLeft(y).tickValues(tickValues));

            // x축 레이블 추가
            svg.append("text")
                .attr("transform", `translate(${(width / 2) + 25} ,${height + margin.bottom - 5})`)
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text(title);

            // y축 레이블 추가
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 65)
                .attr("x", 0 - (height / 2))
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", "14px")
                .text("Age");

            svg.selectAll(".bar")
                .data(inputData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (_, i) => x(i))
                .attr("y", (d) => y(d))
                .attr("width", x.bandwidth())
                .attr("height", (d) => height - y(d))
                .style("fill", "#C8102E");
        };

        renderHistogram(rawSvgRef, rawData, "원본 데이터", false);
        renderHistogram(transformedSvgRef, transformedData, `처리 데이터 (데이터구간: ${mRoundingValue})`, true);
    }, [data, mRoundingValue, isSorted]);

    return (
        <div>
            <div className="d-flex py-3">
                <div className="ms-auto me-4" style={{width: "30%"}}>
                    <div className="d-flex align-items-center mt-3">
                        <p className="me-2">
                            <strong>파라미터 조정</strong>{' '}
                        </p>
                        <div className="mb-2">
                            <input
                                type="range"
                                className="form-range"
                                id="rounding-range"
                                min="3"
                                max="21"
                                step="2"
                                value={mRoundingValue}
                                onChange={(e) => setMRoundingValue(parseInt(e.target.value, 10))}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <svg ref={rawSvgRef} width="50%" height="400" style={{marginLeft: "30px"}}></svg>
                <svg ref={transformedSvgRef} width="50%" height="400"></svg>
            </div>
            <div className="d-flex">
                <div className="ms-auto">
                    <div className="form-check">
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
                </div>
            </div>
        </div>
    );
};

export default P12;
