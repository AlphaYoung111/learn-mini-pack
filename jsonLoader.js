export function jsonLoader (source) {
  console.log('jsonloader', source);
  this.addDeps('i am add')
  return `export default ${JSON.stringify(source)}`
}