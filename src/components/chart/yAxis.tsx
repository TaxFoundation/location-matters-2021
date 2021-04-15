import { ScaleLinear } from 'd3-scale';
import React from 'react';

import { formatter } from '../../helpers';
import Text from './Text';

const YAxis: React.VFC<{
  title: string;
  domain: number[];
  scale: ScaleLinear<number, number>;
  dimensions: dimensions;
  margin: margin;
}> = ({ title, domain, scale, dimensions, margin }) => {
  const ticks = scale.ticks().map((value: number) => ({
    value,
    yOffset: scale(value),
  }));

  const labelPosition = (dimensions.height - margin.top - margin.bottom) / 2;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <Text
        fontSize="18px"
        transform={`translate(-${
          margin.left - 15
        }px, ${labelPosition}px) rotate(-90deg)`}
      >
        {title}
      </Text>
      {ticks.map(({ value, yOffset }) => (
        <g key={`y-${value}`} transform={`translate(0, ${yOffset})`}>
          <line
            x2={dimensions.width - margin.left - margin.right}
            stroke="#eee"
          ></line>
          <line x2="-6" stroke="currentColor"></line>
          <Text
            fontSize="14px"
            textAnchor="end"
            transform="translate(-8px, 3px)"
          >
            {formatter(value, 0)}
          </Text>
        </g>
      ))}
      <line
        x1={0}
        x2={0}
        y1={scale(domain[0])}
        y2={scale(domain[1])}
        stroke="currentColor"
      />
    </g>
  );
};

export default YAxis;
