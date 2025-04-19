import React, { useState, useRef, useEffect } from 'react';
import { line, scaleLinear, select } from 'd3';
import * as d3 from 'd3';
import './LineGraph.css';

const LineGraph = ({ data, data2, xMin, xMax, yMin, yMax }) => {
  const ref = useRef();

  const layout = {
    width: 1000,
    height: 500,
    marginBottom: 480,
    marginLeft: 30,
  };

  const graphDetails = {
    xScale: scaleLinear().range([0, layout.width]),
    yScale: scaleLinear().range([layout.height, 0]),
    lineGenerator: line(),
  };

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement.selectAll('g').remove();

    const bottomAxisGenerator = d3.axisBottom(graphDetails.xScale);
    const leftAxisGenerator = d3.axisLeft(graphDetails.yScale);

    bottomAxisGenerator.tickFormat((d, i) => new Date(d).toLocaleTimeString());

    svgElement
      .append('g')
      .attr('transform', `translate(${layout.marginLeft},${layout.marginBottom})`)
      .call(bottomAxisGenerator);
    svgElement
      .append('g')
      .attr('transform', `translate(${layout.marginLeft},10)`)
      .call(leftAxisGenerator);
  }, [data]);

  graphDetails.xScale.domain([xMin, xMax]);
  graphDetails.yScale.domain([yMin, yMax]);

  graphDetails.lineGenerator.x((d) => graphDetails.xScale(d['x']));
  graphDetails.lineGenerator.y((d) => graphDetails.yScale(d['y']));

  const lineData = graphDetails.lineGenerator(data);
  const lineData2 = data2 ? graphDetails.lineGenerator(data2) : null;

  return (
    <svg
      ref={ref}
      id="lineGraph"
      className="lineGraph"
      width={'100%'}
      height={layout.height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
    >
      <path transform={`translate(${layout.marginLeft}, 0)`} className="graphData" d={lineData} />
      {lineData2 ? (
        <path
          transform={`translate(${layout.marginLeft}, 0)`}
          className="graphData2"
          d={lineData2}
        />
      ) : null}
    </svg>
  );
};

export default LineGraph;
