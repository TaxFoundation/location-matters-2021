/* eslint-disable @typescript-eslint/no-var-requires */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const showdown = require('showdown');

const STATES = require('./data/states.json');

const DATA_SOURCE = path.resolve(__dirname, 'data/location-matters.xlsx');
const TEXT_SOURCE = path.resolve(__dirname, 'data/state-text/original');
const DATA_DEST = path.resolve(__dirname, 'data/location-matters-data.json');
const TEXT_DEST = path.resolve(__dirname, 'data/state-text/cleaned');

const workbook = XLSX.readFile(DATA_SOURCE);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(worksheet);

const formatValue = percentage => {
  if (typeof percentage === 'string') {
    return Number(Number(percentage).toFixed(3));
  }
  return Number(percentage.toFixed(3));
};

const processedData = [];

function buildText() {
  const files = fs.readdirSync(TEXT_SOURCE);
  let compiledData = [];
  for (let i = 0, j = files.length; i < j; i++) {
    const file = files[i];
    console.log(`Reading ${file}...`);
    let state = {};
    const text = fs.readFileSync(path.join(TEXT_SOURCE, file), 'utf8');
    const converter = new showdown.Converter({ metadata: true });
    const html = converter.makeHtml(text);
    const { data: metadata } = matter(text);
    state.id = metadata.id;
    state.name = metadata.name;
    state.text = html;
    compiledData.push(state);
    fs.writeFileSync(
      path.join(TEXT_DEST, `${state.id}.json`),
      JSON.stringify(state),
    );
    console.log(`Finished parsing ${file}.`);
  }
  fs.writeFileSync(
    path.join(TEXT_DEST, `data.json`),
    JSON.stringify(compiledData),
  );
  console.log('New data written successfully.');
}

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
          i: 0,
          p: 0,
          s: 0,
          ui: 0,
          rank: 0,
        },
        old: {
          i: 0,
          p: 0,
          s: 0,
          ui: 0,
          rank: 0,
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
    ].rank = +String(entry.Rank).replace(/[()]/g, '');
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

  fs.writeFileSync(DATA_DEST, JSON.stringify(processedData));
  console.log('New data written successfully.');
}

function buildAll() {
  buildText();
  buildData();
}

if (process.argv.includes('--watch')) {
  buildAll();
  console.log('Watching for data chanes...');
  fs.watch(DATA_SOURCE, { encoding: 'utf-8' }, buildAll);
} else {
  buildAll();
}
