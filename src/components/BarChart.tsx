import React from 'react';
import { scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';

import firmTypes from '../data/firm-types.json';
import { formatter } from '../helpers';
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
  bottom: 70,
  left: 60,
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

const getHeight = (scaleZero: number, scaleRate: number): number => {
  return Math.abs(scaleZero - scaleRate);
};

const Bar = ({
  title,
  rate,
  fill,
  y,
  width,
  height,
}: {
  title: string;
  rate: number;
  fill: string;
  y: number;
  width: number;
  height: number;
}): JSX.Element => {
  return (
    <g>
      <title>{`${title}: ${formatter(rate)}`}</title>
      <rect fill={fill} y={y} width={width} height={height}></rect>
    </g>
  );
};

const Bars: React.VFC<{
  rates: Rates;
  type: string;
}> = ({ rates, type }) => {
  const bottom = dimensions.height - margin.top - margin.bottom;
  const totalRates = rates.ui + rates.s + rates.p + rates.i;
  const uiHeight = getHeight(yScale(0), yScale(rates.ui));
  const sHeight = getHeight(yScale(0), yScale(rates.s));
  const pHeight = getHeight(yScale(0), yScale(rates.p));
  const iHeight = getHeight(yScale(0), yScale(rates.i));
  const bars = [
    {
      rate: rates.ui,
      title: 'Unemployment Insurance',
      fill: '#b81515',
      height: uiHeight,
      y: bottom - uiHeight,
    },
    {
      rate: rates.s,
      title: 'Sales Tax',
      fill: '#23a089',
      height: sHeight,
      y: bottom - uiHeight - sHeight,
    },
    {
      rate: rates.p,
      title: 'Property Tax',
      fill: '#6711a0',
      height: pHeight,
      y: bottom - uiHeight - sHeight - pHeight,
    },
    {
      rate: rates.i,
      title: 'Income Tax',
      fill: '#d2cd3a',
      height: iHeight,
      y: bottom - uiHeight - sHeight - pHeight - iHeight,
    },
  ];

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
      {bars.map(bar => (
        <Bar
          key={`${type}-${bar.title}`}
          title={bar.title}
          rate={bar.rate}
          fill={bar.fill}
          width={oldAndNewScale.bandwidth()}
          y={bar.y}
          height={bar.height}
        />
      ))}
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
          title="Tax Rate"
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
          title="Type of Firm"
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
