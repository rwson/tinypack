const path = require('path');
const fs = require('fs-extra');

const { getAST, getDependencies, transform } = require('./parser');

function Compiler(options) {
  const { entry, output } = options;
  this.entry = entry.path;
  this.entryFile = entry.filename;
  this.output = output;
  this.modules = [];
}

Compiler.prototype = {

  constructor: Compiler,

  /**
   * 开始编译流程
   */
  run() {
    const entryModule = this.buildModule(path.join(this.entry, this.entryFile), true);

    this.modules.push(entryModule);
    
    /**
     * [
     *    {
     *        filename: '/xxxxxx/tinypack/src/index.js',
     *        dependencies: ['./a.js', '../b.js'],
     *        transformCode: babel-core 转换后的源码
     *    }
     * ]
     */
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    });

    this.emitFiles();
  },

  /**
   * 编译模块
   * @param {*} filename 
   * @param {*} isEntry 
   */
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      const absolutePath = path.join(this.entry, filename);
      ast = getAST(absolutePath);
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      transformCode: transform(ast)
    };
  },

  /**
   * 输出物理文件
   */
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);

    let modules = '';
    this.modules.map((_module) => {
      modules += `'${_module.filename}' : function(require, module, exports) {${_module.transformCode}},`;
    });

    const bundle = `
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('${this.entry}')
        })({${modules}})
    `;

    fs.ensureDirSync(this.output.path);
    fs.writeFileSync(outputPath, bundle, "utf-8");
  }

};

module.exports = Compiler;