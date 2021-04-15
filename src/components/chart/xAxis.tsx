import { ScaleBand } from 'd3-scale';
import React from 'react';

import Text from './Text';

const XAxis: React.VFC<{
  title: string;
  domain: string[];
  firmScale: ScaleBand<string>;
  oldAndNewScale: ScaleBand<string>;
  dimensions: dimensions;
  margin: margin;
  yPos: number;
}> = ({
  title,
  domain,
  firmScale,
  oldAndNewScale,
  dimensions,
  margin,
  yPos,
}) => {
  const bottom: number = dimensions.height - margin.top - margin.bottom;
  const xPosition = (value: string): number => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return firmScale(value)! + firmScale.bandwidth() / 2;
  };

  const labelPosition = (dimensions.width - margin.left - margin.right) / 2;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <Text
        fontSize="18px"
        transform={`translate(${labelPosition}px, ${dimensions.height - 24}px)`}
      >
        {title}
      </Text>
      <line
        x1={0}
        x2={dimensions.width - margin.left - margin.right}
        y1={bottom}
        y2={bottom}
        stroke="#ccc"
      />
      <line
        x1={0}
        x2={dimensions.width - margin.left - margin.right}
        y1={yPos}
        y2={yPos}
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
          <g
            transform={`translate(${
              xPosition(value) - oldAndNewScale.bandwidth() / 2
            }, 15)`}
          >
            <Text
              textAnchor="end"
              transform={`translate(${oldAndNewScale('Old')}, 0)`}
            >
              M
            </Text>
            <Text
              textAnchor="end"
              transform={`translate(${oldAndNewScale('New')}, 0)`}
            >
              O
            </Text>
          </g>
          <Text transform="translate(0, 35px)" fontSize="14px">
            {value
              .replace('-', '- ')
              .split(/[\s]/)
              .map((word, i) => {
                return (
                  <tspan
                    key={`firm-${value}-${i}`}
                    x={xPosition(value)}
                    dy={i === 0 ? 0 : 16}
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
