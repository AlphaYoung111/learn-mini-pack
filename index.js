import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'
import { jsonLoader } from './jsonLoader.js'
import ChangeOutputPath from './ChangeOutputPath.js'
import { SyncHook } from 'tapable'

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [jsonLoader]
      }
    ]
  },

  plugins: [
    new ChangeOutputPath({
      path: './dist/test_bundle.js'
    })
  ]
}


const hooks = {
  emitFile: new SyncHook(['pluginContxt'])
}


let id = 0
function createAssets (filePath) {
  // 获取文件内容
  let source = fs.readFileSync(filePath, {
    encoding: 'utf8',
  })

  // 初始化loader
  const loaders = webpackConfig.module.rules

  const loadersContxt = {
    addDeps (dep) {
      console.log('addDeps', dep);
    }
  }

  loaders.forEach(({ test, use }) => {
    // 匹配配置中的正则
    if (test.test(filePath)) {

      if (Array.isArray(use)) {
        // 执行顺序是从右往左
        use.reverse().forEach(fn => {
          source = fn.call(loadersContxt, source)
        })
      } else {
        source = use.call(loadersContxt, source)
      }

    }
  })

  // 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: 'module',
  })

  const deps = []

  // 遍历树
  traverse.default(ast, {
    // 当访问到这个节点的时候就会执行这个函数
    ImportDeclaration ({ node }) {
      deps.push(node.source.value)
    },
  })

  // 转换esm语法为commonjs
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  })

  return {
    filePath,
    code,
    deps,
    id: id++,
    mapping: {},
  }
}

function createGraph () {
  const assetsMain = createAssets('./example/main.js')

  const queue = [assetsMain]

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAssets(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }

  return queue
}


function initPlugins () {
  const plugins = webpackConfig.plugins
  plugins.forEach(plugin => {
    plugin.apply(hooks)
  })
}

initPlugins()

const graph = createGraph()

function build (graph) {
  const template = fs.readFileSync('./bundle.ejs', {
    encoding: 'utf-8',
  })

  // 创建ejs传入立即执行函数的参数
  const data = graph.map((asset) => ({
    id: asset.id,
    code: asset.code,
    mapping: asset.mapping,
  }))

  const code = ejs.render(template, { data })

  // 修改打包后的位置
  let outputPath = './dist/bundle.js'

  const pluginContxt = {
    changeOutputPath (path) {
      outputPath = path
    }
  }


  hooks.emitFile.call(pluginContxt)
  fs.writeFileSync(outputPath, code)
}

build(graph)
