import fs from 'fs'

function createAssets () {
  // 获取文件内容
  const result = fs.readFileSync('./example/main.js',{
    encoding:'utf8'
  })

  console.log(result);

  // 获取依赖关系
  return {
    
  }
}

createAssets()