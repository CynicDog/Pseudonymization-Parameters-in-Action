import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const P12 = ({ data }) => {
    const [mRoundingValue, setMRoundingValue] = useState(5); // 데이터구간 초기값
    const rawSvgRef = useRef(null); // 원본 데이터 SVG 참조
    const transformedSvgRef = useRef(null); // 변환된 데이터 SVG 참조

    useEffect(() => {
        const rawData = data.data;

        // MROUND 함수
        const applyRounding = (value, interval) => {
            return Math.round(value / interval) * interval; // 데이터를 구간에 맞게 반올림
        };

        // 데이터 변환
        const transformedData = rawData.map((d) => applyRounding(d, mRoundingValue));

        // 공통 히스토그램 렌더링 함수
        const renderHistogram = (svgRef, inputData, title, isTransformed) => {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // 기존에 그려진 그래프 초기화

            const margin = { top: 20, right: 15, bottom: 45, left: 50 }; // 여백 설정
            const width = svgRef.current.clientWidth - margin.left - margin.right; // 너비 계산
            const height = svgRef.current.clientHeight - margin.top - margin.bottom; // 높이 계산

            // x축 스케일 (각 데이터 항목에 대해 200개 bin 생성)
            const x = d3.scaleBand()
                .domain(d3.range(inputData.length)) // 데이터 개수만큼 x축 값 설정
                .range([50, width]) // x축 범위 설정
                .padding(0.3); // 바 간격 설정

            // y축 스케일 (데이터 값의 범위 설정)
            const minYValue = d3.min(inputData); // y축 최소값
            const maxYValue = d3.max(inputData); // y축 최대값
            const y = d3.scaleLinear()
                .domain([0, maxYValue]) // y축 범위 설정
                .range([height, 10]); // y축 범위 설정

            // 동적으로 틱 값을 설정 (변환된 데이터와 원본 데이터에 따라 다르게 설정)
            let tickValues = [];
            if (isTransformed) {
                // 변환된 데이터에 대해 mRoundingValue에 맞춰 틱 값 생성
                for (let i = minYValue; i <= maxYValue; i += mRoundingValue) {
                    tickValues.push(i);
                }
            } else {
                // 원본 데이터에 대해 10의 배수로 틱 값 생성
                for (let i = 10; i <= maxYValue; i += 10) {
                    tickValues.push(i);
                }
            }

            // x축 그리기
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickFormat(() => "").tickSize(0)); // 빈 x축 표시

            // y축 그리기 (동적 틱 값 사용)
            svg.append("g")
                .attr("transform", "translate(50,0)")  // 클리핑 방지를 위해 x축 이동
                .style("font-size", "14px")
                .call(d3.axisLeft(y).tickValues(tickValues)); // 동적 y축 틱 값 설정

            // x축 레이블 추가
            svg.append("text")
                .attr("transform", `translate(${width / 2},${height + margin.bottom - 5})`)
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text(title); // "원본 데이터" 또는 "처리 데이터" 텍스트 추가

            // y축 레이블 추가
            svg.append("text")
                .attr("transform", "rotate(-90)") // y축 텍스트 세로로 회전
                .attr("y", 0 - margin.left + 65) // y축 위치 조정
                .attr("x", 0 - (height / 2)) // 텍스트 위치 조정
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", "16px")
                .text("Age"); // "Age" 레이블 추가

            // 히스토그램 막대 추가
            svg.selectAll(".bar")
                .data(inputData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (_, i) => x(i)) // 각 데이터를 x축에 매핑
                .attr("y", (d) => y(d))
                .attr("width", x.bandwidth())
                .attr("height", (d) => height - y(d))
                .style("fill", "#C8102E"); // 막대 색상 설정
        };

        // 원본 데이터 히스토그램 (Set ticks to multiples of 10)
        renderHistogram(rawSvgRef, rawData, "원본 데이터", false);

        // 변환된 데이터 히스토그램 (Set ticks dynamically based on mRoundingValue)
        renderHistogram(transformedSvgRef, transformedData, `처리 데이터 (데이터구간: ${mRoundingValue})`, true);
    }, [data, mRoundingValue]);

    return (
        <div>
            <div className="d-flex py-3">
                <div className="ms-auto" style={{ width: "30%" }}>
                    <p><strong>파라미터 값</strong>: <u className="fw-lighter">{mRoundingValue}</u></p>
                    <input
                        type="range"
                        className="form-range"
                        id="rounding-range"
                        min="3"
                        max="21"
                        step="2"
                        value={mRoundingValue}
                        onChange={(e) => setMRoundingValue(parseInt(e.target.value, 10))}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <svg ref={rawSvgRef} width="50%" height="400" style={{ marginLeft: "30px" }}></svg>
                <svg ref={transformedSvgRef} width="50%" height="400"></svg>
            </div>
        </div>
    );
};

export default P12;
