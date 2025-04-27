import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { rollup } from 'rollup'
import virtual from '@rollup/plugin-virtual'
import sourcemaps from 'rollup-plugin-sourcemaps2'
import { createPathTransform } from 'rollup-sourcemap-path-transform'
import { minify } from 'rollup-plugin-swc-minify'
import pkg from '../package.json' with { type: 'json '}

const thisDir = import.meta.dirname

export function getOutputOptions(file, plugins) {
	const sourcemapPathTransform = createPathTransform({
		prefixes: {
			'*src/': '/remolo/'
		},
		requirePrefix: true
	})
	return {
		file,
		format: 'iife',
		sourcemap: true,
		sourcemapPathTransform,
		sourcemapExcludeSources: false,
		plugins,
		banner: `/**
  * @preserve
  * remolo v${pkg.version} - AMD module loader compatible with RequireJS for modern web browsers
  * Copyright (c) 2025, Ferdinand Prantl (MIT Licensed)
  * https://github.com/prantlf/remolo
  */`
	}
}

export async function generateBundleOutput(bundle, name, plugins) {
	const outputOptions = getOutputOptions(name, plugins)
	const { output } = await bundle.generate(outputOptions)

	for (const chunkOrAsset of output) {
		if (chunkOrAsset.type === 'chunk') {
			const code = chunkOrAsset.code
			const map = chunkOrAsset.map.toString()
			return { name, code, map }
		}
	}

	throw new Error(`output chunk for ${name} not found`)
}

export function getInputOptions(namespace) {
	namespace = namespace ? `.${namespace}` : ''
	const ensureNamespace = namespace ? `if (!window${namespace}) window${namespace} = {}\n` : ''
	const srcDir = `${thisDir}/../src`
	const entryName = `${srcDir}/remolo.js`
	const entryContent = `import define from './define.js'
import require from './require.js'
import './undefine.js'
import './config.js'

${ensureNamespace}window${namespace}.define = define
window${namespace}.requirejs = window${namespace}.require = require`
	const resolveFromVirtual = {
		resolveId(source) {
			return `${srcDir}/${source}`
		}
	}
	return {
		input: entryName,
		plugins: [
			virtual({ [entryName]: entryContent }), 
			resolveFromVirtual,
			sourcemaps()
		]
  }
}

function createIntegrity(source, algorithm) {
	const hash = createHash(algorithm)
		.update(source)
		.digest()
		.toString('base64')
	return `${algorithm}-${hash}`
}

export function writeBundleOutput({ name, code, map }, outputDir) {
	const outputPath = `${outputDir}/${name}`
	const sri = createIntegrity(code, 'sha256')
	return [
		writeFile(outputPath, code),
		writeFile(`${outputPath}.map`, map),
		writeFile(`${outputPath}.sri`, sri)
	]
}

export async function buildModuleLoader({ namespace, fileName = 'remolo.js', outputDir } = {}) {
	let bundle
	try {
		const inputOptions = getInputOptions(namespace)
		bundle = await rollup(inputOptions)

		const outputs = await Promise.all([
			generateBundleOutput(bundle, fileName),
			generateBundleOutput(bundle, `${fileName.slice(0, -3)}.min.js`, [minify()])
		])

		if (outputDir) {
			await mkdir(outputDir, { recursive: true })
			await Promise.all(outputs.flatMap(output => writeBundleOutput(output, outputDir)))
		}

		return outputs
	} finally {
		if (bundle) await bundle.close()
	}
}
