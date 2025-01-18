import { useEffect, useState, useRef } from "react";
import { useParameter } from "../Context.jsx";
import * as d3 from "d3";

const P13 = ({ data }) => {
    const { focusedParam, setFocusedParam } = useParameter();
    const svgRef = useRef(null);

    // 기본 binning 값. 컨텍스트 변수에서 가져오거나 기본값 10000 사용
    const binningValue = focusedParam.value || 10000;

    useEffect(() => {
        // binning 값이 유효하지 않으면 차트 렌더링을 중단
        if (!binningValue || binningValue === 0) return;

        const incomeData = data.data;

        // 차트가 렌더링될 컨테이너 (svg 태그) reference
        const svg = d3.select(svgRef.current);
        // 기존 차트 지우기 (기존 요소 제거)
        svg.selectAll("*").remove();

        // 마진은 차트의 내부 공간을 확보하기 위해 사용
        const margin = { top: 10, right: 30, bottom: 45, left: 40 };
        // 차트의 실제 크기 계산 (뷰포트 크기에서 마진을 뺀 값)
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;


        // x축 스케일 설정 (데이터 값의 최소, 최대 범위).
        // 데이터의 최소값(`d3.min(incomeData)`)부터 최대값까지의 도메인 차트의 시작점(`0`)부터 차트의 끝(`width`)까지 매핑
        const x = d3.scaleLinear()
            .domain([d3.min(incomeData) - 100, d3.max(incomeData) + 100]) // 입력 도메인 설정
            .range([0, width]);  // 출력 범위 설정 (픽셀 값)

        // 데이터를 bins로 변환. 각 bin은 아래를 포함:
        //   - bin에 속하는 데이터 포인트의 배열 (예: 해당 구간에 포함된 값들)
        //   - bin 경계값 `x0` (구간의 시작 값)과 `x1` (구간의 끝 값)
        const bins = d3.bin()
            // bin 경계를 결정하는 threshold 값 설정:
            //   - x축 스케일의 tick 값을 사용해 binning 경계를 자동 생성
            //   - tick 개수는 데이터의 최대값(d3.max(incomeData))과 binning 값(binningValue)을 기반으로 계산
            .thresholds(x.ticks(Math.ceil(d3.max(incomeData) / binningValue)))
            (incomeData);  // 실제 데이터를 binning하여 결과 생성

        // y축 스케일 설정 (데이터의 빈도를 y축의 범위에 매핑)
        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])  // y축 도메인 설정 (최대 빈도수)
            .range([height, 0]);  // y축의 출력 범위 (픽셀 값)

        // x축 생성 및 그리기
        svg.append("g")
            .attr("transform", `translate(0,${height})`)  // x축 위치 설정
            .call(d3.axisBottom(x));  // x축 그리기

        // y축 생성 및 그리기
        svg.append("g")
            .style("font-size", "14px")  // y축 글꼴 크기
            .style("font-weight", "bold")  // y축 글꼴 두께 설정
            .call(d3.axisLeft(y));  // y축 그리기

        // x축 레이블 추가
        // 레이블은 x축의 중심에 위치하며, 설명 텍스트로 사용
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)  // x축 중심
            .attr("y", height + 45)  // x축 아래에 배치
            .style("text-anchor", "middle")  // 텍스트 중앙 정렬
            .text("Income");  // x축 레이블 텍스트

        // 히스토그램 막대(rectangles) 그리기
        // 각 막대는 bin 데이터를 기반으로 렌더링
        svg.selectAll(".bar")
            .data(bins)  // bin 데이터를 연결
            .enter()  // 데이터 수만큼 요소 생성
            .append("rect")  // 막대(rect) 요소 추가
            .attr("class", "bar")
            .attr("x", d => x(d.x0) + 1)  // 막대의 시작 위치 설정
            .attr("y", d => y(d.length))  // 막대의 y축 시작 위치
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))  // 막대의 너비 설정
            .attr("height", d => height - y(d.length))  // 막대의 높이 설정
            .style("fill", "#C8102E");  // 막대 색상 설정

    }, [data, binningValue]);  // 데이터나 binning 값이 변경될 때마다 차트가 다시 렌더링

    // binning 값을 변경하는 함수
    // 사용자가 binning 슬라이더를 조작하면 호출됨
    const handleBinningChange = (event) => {
        const newBinningValue = parseInt(event.target.value, 10);
        setFocusedParam({
            ...focusedParam,
            value: newBinningValue,  // 새로운 binning 값 설정
        });
    };

    return (
        <div>
            <div className="d-flex py-3">
                <div className="ms-auto" style={{width: "30%"}}>
                    <div>
                        <p><strong>파라미터 값</strong>: <u className="fw-lighter">{binningValue}</u></p>
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

            <svg ref={svgRef} width="100%" height="400" viewBox="0 0 760 400"></svg>
        </div>
    );
};

export default P13;
