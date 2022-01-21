;(function (modulesMap) {
  function require(id) {
    const [fn, mapping] = modulesMap[id]

    const module = {
      exports: {},
    }

    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }

    fn(localRequire, module, module.exports)

    return module.exports
  }

  require(1)
})({
  2: [
    function (require, module, exports) {
      function foo() {
        console.log('foo')
      }

      module.exports = {
        foo,
      }
    },
    {},
  ],
  1: [
    function (require, module, exports) {
      const { foo } = require('./foo.js')
      foo()
      console.log('main')
    },
    { './foo.js': 2 },
  ],
})
