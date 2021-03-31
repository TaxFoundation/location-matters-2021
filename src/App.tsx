import React, { useState, useEffect } from 'react';

import data from './data/location-matters-data.json';
import text from './data/lm-text.json';

import BarChart from './components/BarChart';

function App() {
  const [usState, setUsState] = useState<string>('Alabama');
  const [stateData, setStateData] = useState<StateData | null>(null);

  useEffect(() => {
    setStateData((data.find(d => d.name === usState) as unknown) as StateData);
  }, [usState]);

  return (
    <div>{stateData && <BarChart firms={stateData.firms}></BarChart>}</div>
  );
}

export default App;
