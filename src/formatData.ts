/* eslint-disable @typescript-eslint/no-var-requires */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const SOURCE = path.resolve(__dirname, 'data/Firm_Ranks.xlsx');
const DEST = path.resolve(__dirname, 'data/location-matters-data.json');

const workbook = XLSX.readFile(SOURCE);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

console.log(worksheet);
