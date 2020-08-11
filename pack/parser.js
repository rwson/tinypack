const fs = require('fs-extra');

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {
  
  /**
   * 把代码解析成AST
   */
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');

    return parser.parse(source, {
      sourceType: 'module'
    });
  },

  /**
   * 遍历AST对象，获取当前模块依赖了哪些其他模块
   */
  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      },
    });
    return dependencies;
  },

  /**
   * AST转换成ES5
   */
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    });
    return code;
  },
};