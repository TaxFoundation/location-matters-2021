import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

import data from './data/location-matters-data.json';
import STATES from './data/states.json';
// import text from './data/lm-text.json';

import Select from './components/Select';
import HR from './components/HR';
import BarChart from './components/chart/BarChart';
import StateTable from './components/StateTable';
import FirmTable from './components/FirmTable';

const GlobalStyle = createGlobalStyle`
  :root {
    --tf-blue: hsl(205, 100%, 50%);
    --tf-blue-light: hsl(205, 100%, 90%);
    --gray: #ccc;
  }

  .location-matters {
    font-family: Lato, sans-serif;
    margin: 0 auto;
    max-width: 800px;
  }
`;

function App(): JSX.Element {
  const [usState, setUsState] = useState<number>(1);
  const [stateData, setStateData] = useState<StateData | null>(null);

  useEffect(() => {
    setStateData((data.find(d => d.fips === usState) as unknown) as StateData);
  }, [usState]);

  return (
    <div className="location-matters">
      <GlobalStyle />
      {stateData && (
        <>
          <Select
            heading="Choose a State"
            options={STATES.map(s => ({ id: s.fips, name: s.name }))}
            value={usState}
            setValue={setUsState}
          />
          <BarChart state={stateData.name} firms={stateData.firms}></BarChart>
          <HR />
          <StateTable data={stateData}></StateTable>
          <HR />
          <FirmTable data={data as StateData[]}></FirmTable>
        </>
      )}
    </div>
  );
}

export default App;
