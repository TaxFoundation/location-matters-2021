import React, { useState } from 'react';

import { formatter } from '../helpers';
import Select from './Select';
import Table from './Table';
import NumericCell from './NumericCell';
import _firmTypes from '../data/firm-types.json';
const firmTypes: string[] = _firmTypes;

const getFirm = (data: StateData, firm: string): Firm | null => {
  const firmObject = data.firms.find(f => f.name === firm);
  if (firmObject) {
    return firmObject;
  }
  return null;
};

const format = (value: number | undefined): string | null => {
  if (value) return formatter(value);
  return null;
};

const FirmTable: React.VFC<{ data: StateData[] }> = ({ data }) => {
  const [firm, setFirm] = useState(0);
  return (
    <div>
      <h2>Firm Comparisons</h2>
      <Select
        heading="Choose a Firm"
        options={firmTypes.map((s, i) => ({ id: i, name: s }))}
        value={firm}
        setValue={setFirm}
      />
      <Table>
        <thead>
          <tr>
            <th>State</th>
            <th>Ranking</th>
            <th>Mature Firm Rate</th>
            <th>New Firm Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map(state => (
            <tr key={state.fips}>
              <td>{state.name}</td>
              <NumericCell>{getFirm(state, firmTypes[firm])?.rank}</NumericCell>
              <NumericCell>
                {format(getFirm(state, firmTypes[firm])?.tetr.old)}
              </NumericCell>
              <NumericCell>
                {format(getFirm(state, firmTypes[firm])?.tetr.new)}
              </NumericCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FirmTable;
