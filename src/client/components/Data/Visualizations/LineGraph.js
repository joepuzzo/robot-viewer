import React, { useState, useRef, useEffect } from "react";
import { line, scaleLinear, select } from "d3";
import  * as d3 from "d3";
import './LineGraph.css';

const LineGraph = ({ data }) => {

    const ref = useRef()

    const layout = {
        width: 1000,
        height: 500,
        marginBottom: 475,
        marginLeft: 30
    };


    const graphDetails = {
        xScale: scaleLinear().range([0, layout.width]),
        yScale: scaleLinear().range([layout.height, 0]),
        lineGenerator: line()
    };


    useEffect(() => {
        const svgElement = d3.select(ref.current)
        const bottomAxisGenerator = d3.axisBottom(graphDetails.xScale);
        const leftAxisGenerator = d3.axisLeft(graphDetails.yScale);
        svgElement.append("g")
          .attr("transform", `translate(0,${layout.marginBottom})`)
          .call(bottomAxisGenerator)
        svgElement.append("g")
          .attr("transform", `translate(${layout.marginLeft},0)`)
          .call(leftAxisGenerator)
      }, [])

    

    graphDetails.xScale.domain([0, data.length ]);
    const yVals = data.map((dataPoint) => dataPoint.y);
    const yMax = Math.max(...yVals);
    graphDetails.yScale.domain([0,yMax]);

    graphDetails.lineGenerator.x(d => graphDetails.xScale(d["x"]));
    graphDetails.lineGenerator.y(d => graphDetails.yScale(d["y"]));
    
    const lineData = graphDetails.lineGenerator(data);

    return (
        <svg
            ref={ref}
            id="lineGraph"
            className="lineGraph"
            width={"100%"}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="none"
        >
            <path transform={`translate(${layout.marginLeft}, 0)`} className="graphData" d={lineData} />
        </svg>
    );
};

export default LineGraph;