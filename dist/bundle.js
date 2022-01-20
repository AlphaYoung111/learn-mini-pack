;(function (modulesMap) {
  function require(filePath) {
    const fn = modulesMap[filePath]

    const module = {
      exports: {},
    }

    fn(require, module, module.exports)

    return module.exports
  }

  require('./main.js')
})({
  
    "./example/main.js": function (require, module, exports) {
      "use strict";

var _foo = require("./foo.js");

var _foo2 = _interopRequireDefault(_foo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _foo2.default)();
console.log('main.js');
    },
  
    "d:\code\learn-mini-pack\example\foo.js": function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

var _bar2 = _interopRequireDefault(_bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo() {
  console.log('foo');
}
    },
  
    "d:\code\learn-mini-pack\example\bar.js": function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('I am bar');
}
    },
    

})
