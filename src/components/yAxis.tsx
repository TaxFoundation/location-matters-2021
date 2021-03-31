import { ScaleLinear } from 'd3-scale';
import React, { useMemo } from 'react';

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
      <line
        x1={0}
        x2={0}
        y1={scale(domain[0])}
        y2={scale(domain[1])}
        stroke="currentColor"
      />
      {ticks.map(({ value, yOffset }) => (
        <g key={`y-${value}`} transform={`translate(0, ${yOffset})`}>
          <line x2="-6" stroke="currentColor"></line>
          <text
            style={{
              fontFamily: 'sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              stroke: 'currentcolor',
              textAnchor: 'end',
              transform: 'translate(-10px, 3px)',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
};

export default YAxis;
