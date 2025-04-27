import { modules } from './registry.js'
import require from './require.js'

require.specified = function specified(name) {
  return modules.has(name)
}

require.defined = function defined(name) {
  const module = modules.get(name)
  return !!(module?.deps)
}

require.undef = function undefine(name) {
  modules.delete(name)
}
