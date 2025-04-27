import { getDir } from './path-utils.js'

export const modules = new Map // name => { deps, fn, dir, wait, load, exp }
// export const paths = {}
// export const bundles = {}
export const config = {}
export const registry = {
  baseUrl: getDir(document.baseURI),
  // paths,
  // bundles,
  config
}
