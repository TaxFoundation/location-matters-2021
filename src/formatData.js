/* eslint-disable @typescript-eslint/no-var-requires */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const STATES = require('./data/states.json');

const SOURCE = path.resolve(__dirname, 'data/Firm_Ranks.xlsx');
const DEST = path.resolve(__dirname, 'data/location-matters-data.json');

const workbook = XLSX.readFile(SOURCE);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(worksheet);

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
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].ui = entry.UI;
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].s = entry.Sales;
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].p = entry.Property;
    processedData[stateLocation].firms[firmLocation][
      entry.Status === 'Mature' ? 'old' : 'new'
    ].i = entry['Income & Business'];
    processedData[stateLocation].firms[firmLocation].tetr[
      entry.Status === 'Mature' ? 'old' : 'new'
    ] = entry.Total;
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
