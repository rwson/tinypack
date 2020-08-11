const path = require('path');

module.exports = {
  entry: {
    path: path.join(__dirname, './src'),
    filename: 'index.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
};