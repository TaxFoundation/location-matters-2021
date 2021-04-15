import React from 'react';
import { scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';

import firmTypes from '../../data/firm-types.json';
import taxTypes from '../../data/tax-types.json';
import { formatter } from '../../helpers';
import Legend from './Legend';
import Bar from './Bar';
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
  bottom: 90,
  left: 60,
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

const getHeight = (scaleZero: number, scaleRate: number): number => {
  return Math.abs(scaleZero - scaleRate);
};

const Bars: React.VFC<{
  rates: Rates;
  type: string;
  yScale: ScaleLinear<number, number>;
}> = ({ rates, type, yScale }) => {
  const yPos = yScale(0);
  const totalRates = rates.ui + rates.s + rates.p + rates.i;
  const absoluteTotal =
    Math.abs(rates.ui) +
    Math.abs(rates.s) +
    Math.abs(rates.p) +
    Math.abs(rates.i);
  const uiHeight = getHeight(yScale(0), yScale(rates.ui));
  const sHeight = getHeight(yScale(0), yScale(rates.s));
  const pHeight = getHeight(yScale(0), yScale(rates.p));
  const iHeight = getHeight(yScale(0), yScale(rates.i));
  const bars = [
    {
      rate: rates.ui,
      title: taxTypes.ui.name,
      fill: taxTypes.ui.color,
      height: uiHeight,
      y: yPos - uiHeight,
    },
    {
      rate: rates.s,
      title: taxTypes.s.name,
      fill: taxTypes.s.color,
      height: sHeight,
      y: yPos - uiHeight - sHeight,
    },
    {
      rate: rates.p,
      title: taxTypes.p.name,
      fill: taxTypes.p.color,
      height: pHeight,
      y: yPos - uiHeight - sHeight - pHeight,
    },
    {
      rate: rates.i,
      title: taxTypes.i.name,
      fill: taxTypes.i.color,
      height: iHeight,
      y: yPos - uiHeight - sHeight - pHeight - iHeight,
    },
  ];

  const labelXPos = oldAndNewScale.bandwidth() / 2;
  const labelYPos = totalRates >= 0 ? yScale(totalRates) - 17 : yPos - 17;

  return (
    <g transform={`translate(${oldAndNewScale(type)}, 0)`}>
      <Text
        fontSize="11px"
        transform={`translate(${labelXPos}px, ${labelYPos}px)`}
      >
        {type}
      </Text>
      <Text
        fontSize="11px"
        transform={`translate(${labelXPos}px, ${labelYPos + 12}px)`}
      >
        {formatter(totalRates)}
      </Text>
      {absoluteTotal === totalRates ? (
        bars.map(bar => (
          <Bar
            key={`${type}-${bar.title}`}
            text={`${bar.title}: ${formatter(bar.rate)}`}
            fill={bar.fill}
            width={oldAndNewScale.bandwidth()}
            y={bar.y}
            height={bar.height}
          />
        ))
      ) : (
        <Bar
          text={`Combined Total Rate: ${formatter(totalRates)}\nUI: ${formatter(
            rates.ui,
          )}\nSales: ${formatter(rates.s)}\nProperty: ${formatter(
            rates.p,
          )}\nIncome: ${formatter(rates.i)}`}
          fill="#1B2E68"
          width={oldAndNewScale.bandwidth()}
          y={totalRates >= 0 ? yScale(totalRates) : yScale(0)}
          height={getHeight(yScale(0), yScale(totalRates))}
        />
      )}
    </g>
  );
};

const BarGroup: React.VFC<{
  firm: Firm;
  yScale: ScaleLinear<number, number>;
}> = ({ firm, yScale }) => {
  return (
    <g transform={`translate(${firmScale(firm.name)}, 0)`}>
      <Bars rates={firm.old} type="Old" yScale={yScale} />
      <Bars rates={firm.new} type="New" yScale={yScale} />
    </g>
  );
};

const BarChart: React.VFC<{ firms: Firm[] }> = ({ firms }) => {
  const yScale: ScaleLinear<number, number> = scaleLinear();
  const yDomain = [
    Math.max(
      0.35,
      Math.max(...firms.map(f => f.tetr.old)) + 0.05,
      Math.max(...firms.map(f => f.tetr.new)) + 0.05,
    ),
    Math.min(
      0,
      Math.min(...firms.map(f => f.tetr.old)) - 0.05,
      Math.min(...firms.map(f => f.tetr.new)) - 0.05,
    ),
  ];
  yScale.domain(yDomain);
  yScale.range([0, dimensions.height - margin.top - margin.bottom]);
  return (
    <div>
      <Legend />
      <svg
        id="bar-chart"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <YAxis
          title="Tax Rate"
          domain={yDomain}
          scale={yScale}
          dimensions={dimensions}
          margin={margin}
        />
        <g id="bars" transform={`translate(${margin.left}, ${margin.right})`}>
          {firms.map(firm => (
            <BarGroup key={`firm-${firm.name}`} firm={firm} yScale={yScale} />
          ))}
        </g>
        <XAxis
          title="Type of Firm"
          domain={firmTypes}
          scale={firmScale}
          dimensions={dimensions}
          margin={margin}
          yPos={yScale(0)}
        />
      </svg>
    </div>
  );
};

export default BarChart;
