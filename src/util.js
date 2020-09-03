const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const genScriptContent = async function() {
  const sourcePath = path.resolve(__dirname, './script/index.js');
  const result = await promisify(fs.readFile)(sourcePath, 'utf-8');
  return result;
};

module.exports = {
  sleep,
  genScriptContent,
};
