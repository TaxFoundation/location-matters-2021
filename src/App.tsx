import React, { useState, useEffect } from 'react';

import data from './data/location-matters-data.json';
import STATES from './data/states.json';
// import text from './data/lm-text.json';

import Select from './components/Select';
import BarChart from './components/chart/BarChart';
import StateTable from './components/StateTable';
import FirmTable from './components/FirmTable';

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
          <Select
            options={STATES.map(s => ({ id: s.fips, name: s.name }))}
            value={usState}
            setValue={setUsState}
          />
          <BarChart state={stateData.name} firms={stateData.firms}></BarChart>
          <StateTable data={stateData}></StateTable>
          <FirmTable data={data as StateData[]}></FirmTable>
        </>
      )}
    </div>
  );
}

export default App;
