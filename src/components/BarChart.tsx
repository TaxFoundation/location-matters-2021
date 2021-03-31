import React from 'react';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';

import firmTypes from '../data/firm-types.json';

const dimensions = {
  width: 800,
  height: 500,
};

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

const firmScale: ScaleBand<string> = scaleBand();
firmScale.domain(firmTypes);
firmScale.range([0, dimensions.width - margin.left - margin.right]);
firmScale.round(true);
firmScale.padding(0.2);

const oldAndNewScale: ScaleBand<string> = scaleBand();
oldAndNewScale.domain(['Old', 'New']);
oldAndNewScale.range([0, firmScale.bandwidth()]);
oldAndNewScale.round(true);
oldAndNewScale.padding(0.1);

const yScale: ScaleLinear<number, number> = scaleLinear();
yScale.domain([0, 0.35]);
yScale.range([0, dimensions.height - margin.top - margin.bottom]);

const Bars: React.VFC<{
  rates: Rates;
  type: string;
}> = ({ rates, type }) => {
  const bottom: number = dimensions.height - margin.top - margin.bottom;

  return (
    <g>
      <rect
        fill="#b81515"
        x={oldAndNewScale(type)}
        y={bottom - yScale(rates.ui)}
        width={oldAndNewScale.bandwidth()}
        height={yScale(rates.ui)}
      ></rect>
      <rect
        fill="#23a089"
        x={oldAndNewScale(type)}
        y={bottom - yScale(rates.ui) - yScale(rates.s)}
        width={oldAndNewScale.bandwidth()}
        height={yScale(rates.s)}
      ></rect>
      <rect
        fill="#6711a0"
        x={oldAndNewScale(type)}
        y={bottom - yScale(rates.ui) - yScale(rates.s) - yScale(rates.p)}
        width={oldAndNewScale.bandwidth()}
        height={yScale(rates.p)}
      ></rect>
      <rect
        fill="#d2cd3a"
        x={oldAndNewScale(type)}
        y={
          bottom -
          yScale(rates.ui) -
          yScale(rates.s) -
          yScale(rates.p) -
          yScale(rates.i)
        }
        width={oldAndNewScale.bandwidth()}
        height={yScale(rates.i)}
      ></rect>
    </g>
  );
};

const BarGroup: React.VFC<{
  firm: Firm;
}> = ({ firm }) => {
  return (
    <g transform={`translate(${firmScale(firm.name)}, 0)`}>
      <Bars rates={firm.old} type="Old" />
      <Bars rates={firm.new} type="New" />
    </g>
  );
};

const BarChart: React.VFC<{ firms: Firm[] }> = ({ firms }) => {
  const firmNames: string[] = firms.map(f => f.name);

  return (
    <div>
      <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <g id="bars"></g>
        <g id="left-axis"></g>
        <g id="bottom-axis"></g>
        {firms.map(firm => (
          <BarGroup key={`firm-${firm.name}`} firm={firm} />
        ))}
      </svg>
    </div>
  );
};

export default BarChart;
