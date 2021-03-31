import { ScaleLinear } from 'd3-scale';
import React, { useMemo } from 'react';

import { formatter } from '../helpers';
import Text from './Text';

const YAxis: React.VFC<{
  domain: number[];
  scale: ScaleLinear<number, number>;
  dimensions: dimensions;
  margin: margin;
}> = ({ domain, scale, dimensions, margin }) => {
  const ticks = useMemo(() => {
    return scale.ticks().map((value: any) => ({
      value,
      yOffset: scale(value),
    }));
  }, []);

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {ticks.map(({ value, yOffset }) => (
        <g key={`y-${value}`} transform={`translate(0, ${yOffset})`}>
          <line
            x2={dimensions.width - margin.left - margin.right}
            stroke="#eee"
          ></line>
          <line x2="-6" stroke="currentColor"></line>
          <Text textAnchor="end" transform="translate(-10px, 3px)">
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
