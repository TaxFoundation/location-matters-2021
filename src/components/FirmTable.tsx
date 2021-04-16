import React, { useState } from 'react';

import { formatter } from '../helpers';
import Select from './Select';
import Table, { TH } from './Table';
import NumericCell from './NumericCell';
import _firmTypes from '../data/firm-types.json';
const firmTypes: string[] = _firmTypes;

const getFirm = (data: StateData, firm: string): Firm | null => {
  const firmObject = data.firms.find(f => f.name === firm);
  if (firmObject) {
    return firmObject;
  } else {
    return null;
  }
};

const sortStates = (
  a: StateData,
  b: StateData,
  sortBy: string,
  firm: number,
  asc: boolean,
): number => {
  {
    const aFirm = getFirm(a, firmTypes[firm]);
    const bFirm = getFirm(b, firmTypes[firm]);
    if (sortBy === 'state') return asc ? a.fips - b.fips : b.fips - a.fips;
    if (!aFirm && !bFirm) return 0;
    if (!aFirm) return asc ? 1 : -1;
    if (!bFirm) return asc ? -1 : 1;
    switch (sortBy) {
      case 'mRank':
        return asc
          ? aFirm.old.rank - bFirm.old.rank
          : bFirm.old.rank - aFirm.old.rank;
      case 'mRate':
        return asc
          ? aFirm.tetr.old - bFirm.tetr.old
          : bFirm.tetr.old - aFirm.tetr.old;
      case 'nRank':
        return asc
          ? aFirm.new.rank - bFirm.new.rank
          : bFirm.new.rank - aFirm.new.rank;
      case 'nRate':
        return asc
          ? aFirm.tetr.new - bFirm.tetr.new
          : bFirm.tetr.new - aFirm.tetr.new;
      default:
        return asc ? a.fips - b.fips : b.fips - a.fips;
    }
  }
};

const format = (value: number | undefined): string | null => {
  if (value) return formatter(value);
  return null;
};

const arrowColor = (
  id: string,
  sortBy: string,
  asc: boolean,
  direction: string,
): string => {
  if (direction === 'up') {
    return id === sortBy && asc ? '#0094ff' : '#ccc';
  }
  return id === sortBy && !asc ? '#0094ff' : '#ccc';
};

const FirmTable: React.VFC<{ data: StateData[] }> = ({ data }) => {
  const [firm, setFirm] = useState(0);
  const [sortBy, setSortBy] = useState('state');
  const [asc, setAsc] = useState(true);

  const handleSort = (id: string) => {
    if (id === sortBy) {
      setAsc(!asc);
    } else {
      setSortBy(id);
      setAsc(true);
    }
  };

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
            <TH
              upColor={arrowColor('state', sortBy, asc, 'up')}
              downColor={arrowColor('state', sortBy, asc, 'down')}
              onClick={() => {
                handleSort('state');
              }}
            >
              <div>State</div>
            </TH>
            <TH
              upColor={arrowColor('mRank', sortBy, asc, 'up')}
              downColor={arrowColor('mRank', sortBy, asc, 'down')}
              onClick={() => {
                handleSort('mRank');
              }}
            >
              <div>Mature Firm Rank</div>
            </TH>
            <TH
              upColor={arrowColor('mRate', sortBy, asc, 'up')}
              downColor={arrowColor('mRate', sortBy, asc, 'down')}
              onClick={() => {
                handleSort('mRate');
              }}
            >
              <div>Mature Firm Rate</div>
            </TH>
            <TH
              upColor={arrowColor('nRank', sortBy, asc, 'up')}
              downColor={arrowColor('nRank', sortBy, asc, 'down')}
              onClick={() => {
                handleSort('nRank');
              }}
            >
              <div>New Firm Rank</div>
            </TH>
            <TH
              upColor={arrowColor('nRate', sortBy, asc, 'up')}
              downColor={arrowColor('nRate', sortBy, asc, 'down')}
              onClick={() => {
                handleSort('nRate');
              }}
            >
              <div>New Firm Rate</div>
            </TH>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => sortStates(a, b, sortBy, firm, asc))
            .map(state => (
              <tr key={state.fips}>
                <td>{state.name}</td>
                <NumericCell>
                  {getFirm(state, firmTypes[firm])?.old.rank}
                </NumericCell>
                <NumericCell>
                  {format(getFirm(state, firmTypes[firm])?.tetr.old)}
                </NumericCell>
                <NumericCell>
                  {getFirm(state, firmTypes[firm])?.new.rank}
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
