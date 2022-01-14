import fs from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'

function createAssets() {
  // 获取文件内容
  const result = fs.readFileSync('./example/main.js', {
    encoding: 'utf8',
  })

  console.log(result)

  // 获取依赖关系

  const ast = parser.parse(result, {
    sourceType: 'module',
  })

  // 遍历树
  traverse.default(ast, {
    // 当访问到这个节点的时候就会执行这个函数
    ImportDeclaration({node }) {
      console.log(node.source.value)
    },
  })

  console.log(ast)

  return {}
}

createAssets()
