import { ScaleBand } from 'd3-scale';
import React from 'react';

import Text from './Text';

const XAxis: React.VFC<{
  firms: { name: string; old: number; new: number }[];
  firmScale: ScaleBand<string>;
  oldAndNewScale: ScaleBand<string>;
  dimensions: dimensions;
  margin: margin;
  yPos: number;
}> = ({ firms, firmScale, oldAndNewScale, dimensions, margin, yPos }) => {
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
        transform={`translate(${labelPosition}px, ${
          dimensions.height - margin.top - 20
        }px)`}
      >
        Type of Firm, Mature (M) or New (N), and Ranking
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
      {firms.map(firm => (
        <g key={`x-${firm.name}`}>
          <g transform={`translate(0, -5)`}>
            <Text fontSize="14px">
              {firm.name
                .replace('-', '- ')
                .split(/[\s]/)
                .reverse()
                .map((word, i) => {
                  return (
                    <tspan
                      key={`firm-${firm.name}-${i}`}
                      x={xPosition(firm.name)}
                      dy={i === 0 ? 0 : -16}
                    >
                      {word}
                    </tspan>
                  );
                })}
            </Text>
          </g>
          <g key={`x-${firm.name}`} transform={`translate(-4, ${bottom})`}>
            <g
              transform={`translate(${
                xPosition(firm.name) - oldAndNewScale.bandwidth() / 2
              }, 15)`}
            >
              <Text transform={`translate(${oldAndNewScale('Old')}, 0)`}>
                M
              </Text>
              <Text transform={`translate(${oldAndNewScale('New')}, 0)`}>
                N
              </Text>
            </g>
            <g
              transform={`translate(${
                xPosition(firm.name) - oldAndNewScale.bandwidth() / 2
              }, 30)`}
            >
              <Text transform={`translate(${oldAndNewScale('Old')}, 0)`}>
                {firm.old}
              </Text>
              <Text transform={`translate(${oldAndNewScale('New')}, 0)`}>
                {firm.new}
              </Text>
            </g>
          </g>
        </g>
      ))}
    </g>
  );
};

export default XAxis;
