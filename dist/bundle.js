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

  require(0)
})({
  
    "0": [function (require, module, exports) {
      "use strict";

var _foo = require("./foo.js");

var _test = require("./test.json");

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_test2.default);
(0, _foo.foo)();
console.log('main.js');
    },{"./foo.js":1,"./test.json":2} ],
  
    "1": [function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

(0, _bar.bar)();

function foo() {
  console.log('foo');
}
    },{"./bar.js":3} ],
  
    "2": [function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\r\n  \"a\": \"test\"\r\n}";
    },{} ],
  
    "3": [function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('I am bar');
}
    },{} ],
    
})
