/* eslint-disable @typescript-eslint/no-var-requires */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const STATES = require('./data/states.json');

const SOURCE = path.resolve(__dirname, 'data/location-matters.xlsx');
const DEST = path.resolve(__dirname, 'data/location-matters-data.json');

const workbook = XLSX.readFile(SOURCE);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(worksheet);

const formatValue = percentage => {
  if (typeof percentage === 'string') {
    return Number(Number(percentage).toFixed(3));
  }
  return Number(percentage.toFixed(3));
};

const processedData = [];

function buildData() {
  rawData.forEach(entry => {
    const state = STATES.find(s => s.name === entry['State Name']);
    if (!processedData.find(s => s.fips === state.fips)) {
      processedData.push({
        fips: state.fips,
        name: state.name,
        abbr: state.abbr,
        firms: [],
      });
    }
    const stateLocation = processedData.findIndex(s => s.fips === state.fips);
    if (
      !processedData[stateLocation].firms.find(firm => firm.name === entry.Firm)
    ) {
      processedData[stateLocation].firms.push({
        name: entry.Firm,
        rank: 0,
        new: {
          ui: 0,
          s: 0,
          p: 0,
          i: 0,
        },
        old: {
          ui: 0,
          s: 0,
          p: 0,
          i: 0,
        },
        tetr: {
          new: 0,
          old: 0,
        },
      });
    }
    const firmLocation = processedData[stateLocation].firms.findIndex(
      firm => firm.name === entry.Firm,
    );
    processedData[stateLocation].firms[firmLocation].rank = formatValue(
      String(entry.Rank).replace(/[()]/g, ''),
    );
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].ui = formatValue(entry['UI Taxes']);
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].s = formatValue(entry['Sales Taxes']);
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].p = formatValue(entry['Property Taxes']);
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].i = formatValue(entry['Income & Business Taxes']);
    processedData[stateLocation].firms[firmLocation].tetr[
      entry.Status === 'Mature' ? 'old' : 'new'
    ] = formatValue(entry['Total Effective Tax Rate']);
  });

  fs.writeFileSync(DEST, JSON.stringify(processedData));
  console.log('New data written successfully.');
}

if (process.argv.includes('--watch')) {
  buildData();
  console.log('Watching for data chanes...');
  fs.watch(SOURCE, { encoding: 'utf-8' }, buildData);
} else {
  buildData();
}
