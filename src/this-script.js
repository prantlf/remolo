// import { registry } from './registry.js'

export default function getThisScriptName() {
  const script = document.currentScript
  if (!script) throw new Error('The document.currentScript is null')
  const name = script.dataset.requiremodule
  if (!name) throw new Error('The document.currentScript.dataset.requiremodule is empty')
  return name
  // const url = script.src
  // if (!url) throw new Error('The document.currentScript.src is empty')
  // if (url.startsWith(registry.baseUrl)) return url.slice(registry.baseUrl.length, -3)
  // return url
}
