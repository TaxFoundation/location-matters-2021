import React, { useState, useEffect } from 'react';

import data from './data/location-matters-data.json';
import text from './data/lm-text.json';

import BarChart from './components/BarChart';

function App() {
  const [usState, setUsState] = useState<string>('Alabama');
  const [stateData, setStateData] = useState<any | null>(null);

  useEffect(() => {
    const theData: any = data.find(d => d.name === usState)!;
    setStateData(theData);
  }, [usState]);

  return (
    <div>{stateData && <BarChart firms={stateData.firms}></BarChart>}</div>
  );
}

export default App;
