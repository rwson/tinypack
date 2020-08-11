
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('/Users/rwson/My/Code/my-lib(lab)/tinypack/src')
        })({'/Users/rwson/My/Code/my-lib(lab)/tinypack/src/index.js' : function(require, module, exports) {"use strict";

var _hello = require("./hello.js");

document.querySelector('#hello').innerHTML = (0, _hello.hello)('tinypack');},'./hello.js' : function(require, module, exports) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var hello = exports.hello = function hello(text) {
  return "hello " + text;
};},})
    