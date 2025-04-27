import { getDir, resolveName } from './path-utils.js'
import { modules, config, registry } from './registry.js'

function getModuleUrl(name, dir) {
  if (name.startsWith('https://') || name.startsWith('http://') ||
      name.startsWith('file://') || name.startsWith('//')) return name
  if (name.startsWith('.')) name = resolveName(name, dir)
  const url = `${registry.baseUrl}${name}.js`
  return registry.urlArgs ? url + registry.urlArgs(name, url) : url
}

function loadModule(module, name, url) {
  let req
  let mod
  let exp
  return Promise
    .all(module.deps.map(dep => {
      switch (dep) {
        case 'require':
          return req ?? (req = makeRequire(module.dir))
        case 'module':
          return mod ?? (mod = {
            id: name,
            uri: url || getModuleUrl(name, module.dir),
            config() {
              return config[name] ?? {}
            },
            get exports() {
              return exp ?? (exp = {})
            }
          })
        case 'exports':
          return exp ?? (exp = {})
      }
      return requireName(dep, module.dir)
    }))
    .then(exports => {
      module.load = true
      const { fn } = module
      if (typeof fn !== 'function') return module.exp = fn
      try {
        const res = fn(...exports)
        return module.exp = exp ? exp : res
      } catch (err) {
        const wrappedErr = new Error(`Loading ${name} failed: ${err.message}`)
        wrappedErr.reason = err
        throw wrappedErr
      }
    })
}

function insertScript(name, module) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const url = getModuleUrl(name, module.dir)
    const loaded = () => {
      unlisten()
      if (module.deps) loadModule(module, name, url).then(resolve).catch(reject)
      else reject(new Error(`Module ${name} has not been defined`))
    }
    const failed = event => {
      unlisten()
      const err = new Error(`Loading ${name} from ${url} failed`)
      err.script = event.target
      reject(err)
    }
    const unlisten = () => {
      script.removeEventListener('load', loaded)
      script.removeEventListener('error', failed)
    }
    script.dataset.requiremodule = name
    script.dataset.requirecontext = '_'
    script.src = url
    script.addEventListener('load', loaded)
    script.addEventListener('error', failed)
    document.head.appendChild(script)
  })
}

function requireName(name, dir) {
  if (name.startsWith('.')) name = resolveName(name, dir)
  let module = modules.get(name)
  if (module) {
    if (module.dir === undefined) module.dir = getDir(name)
    if (module.load) return module.exp
    if (module.wait) return module.wait
    return module.wait = loadModule(module, name)
  }  
  modules.set(name, module = {})
  module.dir = getDir(name)
  return module.wait = insertScript(name, module)
}

function makeRequire(dir) {
  function require(deps, done, fail) {
    if (typeof deps === 'string') {
      if (deps.startsWith('.')) deps = resolveName(deps, dir)
      const module = modules.get(deps)
      if (!module || !module.deps) throw new Error(`Module ${deps} has not been defined`)
      if (!module.load) throw new Error(`Module ${deps} has not been loaded`)
      return module.exp
    }
    const wait = Promise.all(deps.map(dep => requireName(dep, dir)))
    if (done) wait.then(exports => done(...exports)).catch(fail)
    else return wait
  }
  require.toUrl = function toUrl(name) {
    return getModuleUrl(name, dir)
  }
  return require
}

export default makeRequire('')
