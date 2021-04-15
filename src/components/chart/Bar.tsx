import React from 'react';

import { formatter } from '../../helpers';

const Bar = ({
  text,
  fill,
  y,
  width,
  height,
}: {
  text: string;
  fill: string;
  y: number;
  width: number;
  height: number;
}): JSX.Element => {
  return (
    <g>
      <title>{text}</title>
      <rect fill={fill} y={y} width={width} height={height}></rect>
    </g>
  );
};

export default Bar;
