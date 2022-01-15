// 由于import的语法只能再顶层语法中，所以我们将一个个模块变成函数后，需要将es6的模块语法通过我们自己手写的require函数来使用commonjs的规范去导入文件
function require(filePath) {
  const pathMap = {
    './foo.js': foojs,
    './main.js': mainjs,
  }

  const fn = pathMap[filePath]

  const module = {
    exports: {},
  }

  fn(require, module, module.exports)
}

mainjs()

function mainjs(require, module, exports) {
  const foo = require('./foo.js')
  foo()
  console.log('foo')
}

function foojs(require, module, exports) {
  function foo() {
    console.log('foo')
  }

  module.exports = {
    foo,
  }
}
