import { modules } from './registry.js'
import getThisScriptName from './this-script.js'

export default function define(name, deps, fn) {
  if (typeof name !== 'string') {
    fn = deps
    deps = name
    name = getThisScriptName()
  }
  if (!Array.isArray(deps)) {
    fn = deps
    deps = []
  }
  let module = modules.get(name)
  if (!module) modules.set(name, module = {})
  if (module.deps) throw new Error(`Module ${name} has been already defined`)
  module.deps = deps
  module.fn = fn
}

define.amd = true
