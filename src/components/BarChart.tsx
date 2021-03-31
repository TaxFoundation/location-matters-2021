import React from 'react';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';

const Bars: React.VFC<{
  rates: Rates;
  xScale: number | undefined;
  yScale: Function;
  bottom: number;
}> = ({ rates, xScale, yScale, bottom }) => {
  return (
    <g>
      <rect
        fill="#b81515"
        x={xScale}
        y={bottom - yScale(rates.ui)}
        width={100}
        height={yScale(rates.ui)}
      ></rect>
      <rect
        fill="#23a089"
        x={xScale}
        y={bottom - yScale(rates.ui) - yScale(rates.s)}
        width={100}
        height={yScale(rates.s)}
      ></rect>
      <rect
        fill="#6711a0"
        x={xScale}
        y={bottom - yScale(rates.ui) - yScale(rates.s) - yScale(rates.p)}
        width={100}
        height={yScale(rates.p)}
      ></rect>
      <rect
        fill="#d2cd3a"
        x={xScale}
        y={
          bottom -
          yScale(rates.ui) -
          yScale(rates.s) -
          yScale(rates.p) -
          yScale(rates.i)
        }
        width={100}
        height={yScale(rates.i)}
      ></rect>
    </g>
  );
};

const BarChart: React.VFC<{ firms: Firm[] }> = ({ firms }) => {
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

  const firmNames: string[] = firms.map(f => f.name);

  const xScale: ScaleBand<string> = scaleBand();
  xScale.domain(firmNames);
  xScale.range([0, dimensions.width - margin.left - margin.right]);
  xScale.round(true);
  xScale.padding(0.2);

  const yScale: ScaleLinear<number, number> = scaleLinear();
  yScale.domain([0, 0.35]);
  yScale.range([0, dimensions.height - margin.top - margin.bottom]);

  return (
    <div>
      <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <g id="bars"></g>
        <g id="left-axis"></g>
        <g id="bottom-axis"></g>
        {firms.map(firm => (
          <g key={`firm-${firm.name}`}>
            <Bars
              rates={firm.old}
              xScale={xScale(firm.name)}
              yScale={yScale}
              bottom={dimensions.height - margin.top - margin.bottom}
            ></Bars>
            <Bars
              rates={firm.new}
              xScale={xScale(firm.name)}
              yScale={yScale}
              bottom={dimensions.height - margin.top - margin.bottom}
            ></Bars>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default BarChart;
