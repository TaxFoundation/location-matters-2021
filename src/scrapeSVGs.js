/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const STATES = require('./data/states.json');

const getSVGs = async () => {
  if (!fs.existsSync(path.resolve(__dirname, `svgOutputs`))) {
    fs.mkdirSync(path.resolve(__dirname, `svgOutputs`));
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle2',
  });

  for (let i = 0; i < STATES.length; i++) {
    await page.select('#state-select', String(STATES[i].fips));
    const selectedSVG = await page.$('#bar-chart');
    const SVG = await page.evaluate(svg => svg.outerHTML, selectedSVG);
    fs.writeFileSync(
      path.resolve(__dirname, `svgOutputs/${STATES[i].abbr}.svg`),
      SVG,
    );
    console.log(`Wrote SVG file for ${STATE[i].name}...`);
  }
  console.log('All done!');
  await browser.close();
};

getSVGs();
