import { /* paths, bundles, */ config, registry } from './registry.js'
import mergeObjects from './merge-objects.js'
import require from './require.js'

require.isBrowser = true

require.s = {
  contexts: {
    _: { config: registry }
  }
}

function setBaseUrl(baseUrl) {
  if (baseUrl) {
    if (!baseUrl.endsWith('/')) baseUrl += '/'
    baseUrl = new URL(baseUrl, location).href
  }
  registry.baseUrl = baseUrl
}

function setUrlArgs(urlArgs) {
  if (typeof urlArgs === 'string' && urlArgs) {
    registry.urlArgs = (_id, url) => {
      return urlArgs ? (url.includes('?') ? '&' : '?') + urlArgs : '';
    }
  } else {
    registry.urlArgs = urlArgs
  }
}

require.config = function configure(input) {
  const {
    /* paths: inputPaths, bundles: inputBundles, */ config: inputConfig,
    deps, callback, error
  } = input
  // if (inputPaths) mergeObjects(paths, inputPaths)
  // if (inputBundles) mergeObjects(bundles, inputBundles)
  if (inputConfig) mergeObjects(config, inputConfig)
  if ('baseUrl' in input) setBaseUrl(input.baseUrl)
  if ('urlArgs' in input) setUrlArgs(input.urlArgs)
  if (deps) return require(deps, callback, error)
}
