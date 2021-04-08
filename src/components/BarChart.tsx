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
  yScale: ScaleLinear<number, number>;
}> = ({ rates, type, yScale }) => {
  const bottom = dimensions.height - margin.top - margin.bottom;
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
      title: 'Unemployment Insurance',
      fill: '#C9202F',
      height: uiHeight,
      y: bottom - uiHeight,
    },
    {
      rate: rates.s,
      title: 'Sales Tax',
      fill: '#F89821',
      height: sHeight,
      y: bottom - uiHeight - sHeight,
    },
    {
      rate: rates.p,
      title: 'Property Tax',
      fill: '#019E8A',
      height: pHeight,
      y: bottom - uiHeight - sHeight - pHeight,
    },
    {
      rate: rates.i,
      title: 'Income Tax',
      fill: '#1CBDF0',
      height: iHeight,
      y: bottom - uiHeight - sHeight - pHeight - iHeight,
    },
  ];

  return (
    <g transform={`translate(${oldAndNewScale(type)}, 0)`}>
      <Text
        fontSize="11px"
        transform={`translate(
          ${oldAndNewScale.bandwidth() / 2},
          ${yScale(totalRates) - 17}
        )`}
      >
        {type}
      </Text>
      <Text
        fontSize="11px"
        transform={`translate(
          ${oldAndNewScale.bandwidth() / 2},
          ${yScale(totalRates) - 5}
        )`}
      >
        {formatter(totalRates)}
      </Text>
      {absoluteTotal === totalRates ? (
        bars.map(bar => (
          <Bar
            key={`${type}-${bar.title}`}
            title={bar.title}
            rate={bar.rate}
            fill={bar.fill}
            width={oldAndNewScale.bandwidth()}
            y={bar.y}
            height={bar.height}
          />
        ))
      ) : (
        <Bar
          title="Combined Total Rate"
          rate={totalRates}
          fill="#1B2E68"
          width={oldAndNewScale.bandwidth()}
          y={bottom - getHeight(yScale(0), yScale(totalRates))}
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
    0,
  ];
  yScale.domain(yDomain);
  yScale.range([0, dimensions.height - margin.top - margin.bottom]);
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
            <BarGroup key={`firm-${firm.name}`} firm={firm} yScale={yScale} />
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
