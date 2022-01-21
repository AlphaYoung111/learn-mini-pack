import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import ejs from 'ejs'
import { transformFromAst } from 'babel-core'

let id = 0
function createAssets(filePath) {
  // 获取文件内容
  const source = fs.readFileSync(filePath, {
    encoding: 'utf8',
  })

  // 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: 'module',
  })

  const deps = []

  // 遍历树
  traverse.default(ast, {
    // 当访问到这个节点的时候就会执行这个函数
    ImportDeclaration({ node }) {
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

function createGraph() {
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

const graph = createGraph()

function build(graph) {
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

  fs.writeFileSync('./dist/bundle.js', code)
}

build(graph)
