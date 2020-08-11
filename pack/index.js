const path = require('path');

const cwd = process.cwd();

const Compiler = require('./compile');
const config = require(path.join(cwd, 'tinypack.config.js'));

const compiler = new Compiler(config);
compiler.run();

