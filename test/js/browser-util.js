function tryRequire(module) {
  try {
    const exported = require(module)
    console.log('exported', JSON.stringify(exported))
  } catch (err) {
    console.warn(err)
  }
}
