// allow loading local files for testing

let testFiles = {}; // eslint-disable-line import/no-mutable-exports

if (process.env.NODE_ENV === 'development') {
  try {
    testFiles = require('test/config.js').files || {}; // eslint-disable-line import/no-unresolved
    console.log('loaded files from test/config.js'); // eslint-disable-line no-console
  } catch (e) {
    // no test config found
  }
}
export default testFiles;
