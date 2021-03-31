import { ScaleBand } from 'd3-scale';
import React from 'react';

import Text from './Text';

const XAxis: React.VFC<{
  domain: string[];
  scale: ScaleBand<string>;
  dimensions: dimensions;
  margin: margin;
}> = ({ domain, scale, dimensions, margin }) => {
  const bottom: number = dimensions.height - margin.top - margin.bottom;
  const xPosition = (value: string): number => {
    return scale(value)! + scale.bandwidth() / 2;
  };

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <line
        x1={0}
        x2={dimensions.width - margin.left - margin.right}
        y1={bottom}
        y2={bottom}
        stroke="currentColor"
      />
      {domain.map(value => (
        <g key={`x-${value}`} transform={`translate(0, ${bottom})`}>
          <line
            x1={xPosition(value)}
            x2={xPosition(value)}
            y2="6"
            stroke="currentColor"
          ></line>
          <Text transform="translate(0, 20px)">
            {value.split(' ').map((word, i) => {
              return (
                <tspan
                  key={`firm-${value}-${i}`}
                  x={xPosition(value)}
                  dy={16 * i}
                >
                  {word}
                </tspan>
              );
            })}
          </Text>
        </g>
      ))}
    </g>
  );
};

export default XAxis;
