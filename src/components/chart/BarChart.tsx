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
  height: 600,
};

const margin: margin = {
  top: 65,
  right: 20,
  bottom: 80,
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
  total: number;
  type: string;
  yScale: ScaleLinear<number, number>;
}> = ({ rates, total, type, yScale }) => {
  const yPos = yScale(0);
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
      rate: rates.i,
      title: taxTypes.i.name,
      fill: taxTypes.i.color,
      height: iHeight,
      y: yPos - iHeight,
    },
    {
      rate: rates.p,
      title: taxTypes.p.name,
      fill: taxTypes.p.color,
      height: pHeight,
      y: yPos - iHeight - pHeight,
    },
    {
      rate: rates.s,
      title: taxTypes.s.name,
      fill: taxTypes.s.color,
      height: sHeight,
      y: yPos - iHeight - pHeight - sHeight,
    },
    {
      rate: rates.ui,
      title: taxTypes.ui.name,
      fill: taxTypes.ui.color,
      height: uiHeight,
      y: yPos - iHeight - sHeight - pHeight - uiHeight,
    },
  ];

  const labelXPos = oldAndNewScale.bandwidth() / 2;
  const labelYPos = total >= 0 ? yScale(total) - 5 : yPos - 5;

  return (
    <g transform={`translate(${oldAndNewScale(type)}, 0)`}>
      <Text
        fontSize="10px"
        transform={`translate(${labelXPos}px, ${labelYPos}px)`}
      >
        {formatter(total)}
      </Text>
      {absoluteTotal === total ? (
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
          text={`Combined Total Rate: ${formatter(total)}\nIncome: ${formatter(
            rates.i,
          )}\nSales: ${formatter(rates.s)}\nProperty: ${formatter(
            rates.p,
          )}\nUI: ${formatter(rates.ui)}`}
          fill="#1B2E68"
          width={oldAndNewScale.bandwidth()}
          y={total >= 0 ? yScale(total) : yScale(0)}
          height={getHeight(yScale(0), yScale(total))}
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
      <Bars rates={firm.old} total={firm.tetr.old} type="Old" yScale={yScale} />
      <Bars rates={firm.new} total={firm.tetr.new} type="New" yScale={yScale} />
    </g>
  );
};

const BarChart: React.VFC<{ state: string; firms: Firm[] }> = ({
  state,
  firms,
}) => {
  const max = Math.max(
    Math.max(...firms.map(f => f.tetr.old)),
    Math.max(...firms.map(f => f.tetr.new)),
  );
  const min = Math.min(
    Math.min(...firms.map(f => f.tetr.old)),
    Math.min(...firms.map(f => f.tetr.new)),
  );
  const yScale: ScaleLinear<number, number> = scaleLinear();
  const yDomain = [Math.max(0.35, max + 0.05), min >= 0 ? 0 : min - 0.05];

  const firmRanks = firms.map(firm => ({
    name: firm.name,
    old: firm.old.rank,
    new: firm.new.rank,
  }));
  yScale.domain(yDomain);
  yScale.range([0, dimensions.height - margin.top - margin.bottom]);
  return (
    <div>
      <h2>{`Graph of Effective Tax Rates in ${state}`}</h2>
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
        <g id="bars" transform={`translate(${margin.left}, ${margin.top})`}>
          {firms.map(firm => (
            <BarGroup key={`firm-${firm.name}`} firm={firm} yScale={yScale} />
          ))}
        </g>
        <XAxis
          firms={firmRanks}
          firmScale={firmScale}
          oldAndNewScale={oldAndNewScale}
          dimensions={dimensions}
          margin={margin}
          yPos={yScale(0)}
        />
      </svg>
    </div>
  );
};

export default BarChart;
