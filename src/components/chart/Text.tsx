import React from 'react';

interface IText {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  stroke?: string;
  textAnchor?: string;
  transform?: string;
}

const Text: React.FC<IText> = ({
  children,
  fontFamily = `'Lato', sans-serif`,
  fontSize = '12px',
  fontWeight = 300,
  stroke = 'currentColor',
  textAnchor = 'middle',
  transform = 'none',
}) => {
  console.log(transform);
  return (
    <text
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        stroke,
        transform,
      }}
      textAnchor={textAnchor}
    >
      {children}
    </text>
  );
};

export default Text;
