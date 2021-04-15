import React, { useState, useEffect } from 'react';

import data from './data/location-matters-data.json';
// import text from './data/lm-text.json';

import StateSelect from './components/StateSelect';
import BarChart from './components/chart/BarChart';
import StateTable from './components/StateTable';

function App(): JSX.Element {
  const [usState, setUsState] = useState<number>(1);
  const [stateData, setStateData] = useState<StateData | null>(null);

  useEffect(() => {
    setStateData((data.find(d => d.fips === usState) as unknown) as StateData);
  }, [usState]);

  return (
    <div>
      {stateData && (
        <>
          <StateSelect value={usState} setValue={setUsState} />
          <BarChart state={stateData.name} firms={stateData.firms}></BarChart>
          <StateTable data={stateData}></StateTable>
        </>
      )}
    </div>
  );
}

export default App;
