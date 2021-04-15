import React from 'react';

import { formatter } from '../helpers';
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

const StateTable: React.VFC<{ data: StateData }> = ({ data }) => {
  return (
    <div>
      <h2>Table of Effective Tax Rates in {data.name}</h2>
      <Table>
        <thead>
          <tr>
            <th>Firm Type</th>
            <th>Ranking</th>
            <th>Mature Firm Rate</th>
            <th>New Firm Rate</th>
          </tr>
        </thead>
        <tbody>
          {firmTypes.map(firm => (
            <tr key={firm}>
              <td>{firm}</td>
              <NumericCell>{getFirm(data, firm)?.old.rank}</NumericCell>
              <NumericCell>{format(getFirm(data, firm)?.tetr.old)}</NumericCell>
              <NumericCell>{getFirm(data, firm)?.new.rank}</NumericCell>
              <NumericCell>{format(getFirm(data, firm)?.tetr.new)}</NumericCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StateTable;
