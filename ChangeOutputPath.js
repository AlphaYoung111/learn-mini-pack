class ChangeOutputPath {
  constructor(options) {
    this.options = options
  }

  apply (hooks, options) {
    hooks.emitFile.tap('changeOutputPath', (contxt) => {
      contxt.changeOutputPath(this.options.path)
    })
  }
}

export default ChangeOutputPath