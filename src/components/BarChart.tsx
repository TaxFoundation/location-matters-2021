import React from 'react';

const BarChart: React.VFC<{ firms: Firms[] }> = ({ firms }) => {
  return (
    <div>
      {firms.map(firm => (
        <p>{firm.name}</p>
      ))}
    </div>
  );
};

export default BarChart;
