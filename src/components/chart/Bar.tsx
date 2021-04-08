import React from 'react';

import { formatter } from '../../helpers';

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

export default Bar;
