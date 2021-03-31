import React from 'react';
import { scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';

import firmTypes from '../data/firm-types.json';
import XAxis from './xAxis';
import YAxis from './yAxis';
import Text from './Text';

const dimensions: dimensions = {
  width: 800,
  height: 500,
};

const margin: margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

const yDomain: number[] = [0.35, 0];

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
yScale.domain(yDomain);
yScale.range([0, dimensions.height - margin.top - margin.bottom]);

const formatter = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(value);
};

const Bars: React.VFC<{
  rates: Rates;
  type: string;
}> = ({ rates, type }) => {
  const bottom = dimensions.height - margin.top - margin.bottom;
  const totalRates = rates.ui + rates.s + rates.p + rates.i;
  const uiHeight = yScale(0) - yScale(rates.ui);
  const sHeight = yScale(0) - yScale(rates.s);
  const pHeight = yScale(0) - yScale(rates.p);
  const iHeight = yScale(0) - yScale(rates.i);

  return (
    <g transform={`translate(${oldAndNewScale(type)}, 0)`}>
      <Text
        transform={`translate(
          ${oldAndNewScale.bandwidth() / 2},
          ${yScale(totalRates) - 5}
        )`}
      >
        {formatter(totalRates)}
      </Text>
      <rect
        fill="#b81515"
        y={bottom - uiHeight}
        width={oldAndNewScale.bandwidth()}
        height={uiHeight}
      ></rect>
      <rect
        fill="#23a089"
        y={bottom - uiHeight - sHeight}
        width={oldAndNewScale.bandwidth()}
        height={sHeight}
      ></rect>
      <rect
        fill="#6711a0"
        y={bottom - uiHeight - sHeight - pHeight}
        width={oldAndNewScale.bandwidth()}
        height={pHeight}
      ></rect>
      <rect
        fill="#d2cd3a"
        y={bottom - uiHeight - sHeight - pHeight - iHeight}
        width={oldAndNewScale.bandwidth()}
        height={iHeight}
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
  return (
    <div>
      <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <YAxis
          domain={yDomain}
          scale={yScale}
          dimensions={dimensions}
          margin={margin}
        />
        <g id="bars" transform={`translate(${margin.left}, ${margin.right})`}>
          {firms.map(firm => (
            <BarGroup key={`firm-${firm.name}`} firm={firm} />
          ))}
        </g>
        <XAxis
          domain={firmTypes}
          scale={firmScale}
          dimensions={dimensions}
          margin={margin}
        />
      </svg>
    </div>
  );
};

export default BarChart;
