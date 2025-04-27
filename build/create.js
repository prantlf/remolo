#!/usr/bin/env bun

import { buildModuleLoader } from './loader.js'

const help = () => {
	console.log(`Generates the module loader script.

Usage: remolo-create [options]

Options:
-d|--directory <directory>  output directory (has to be set)
-n|--namespace <namespace>  namespace of the global functions (none)
-f|--filename  <filename>   base name of the output files (remolo.js)
-V|--version                print version number
-h|--help                   print usage instructions

Examples:
$ remolo-create -d dist
$ remolo-create -d dist -n require.js`)
}

const { argv } = process
let outputDir
let namespace
let fileName

for (let i = 2, l = argv.length; i < l; ++i) {
	const arg = argv[i]
	const match = /^(?:-|--)?([a-zA-Z][-a-zA-Z]*)$/.exec(arg)
	if (match) {
		switch (match[1]) {
			case 'd': case 'directory':
				outputDir = argv[++i]
				continue
			case 'n': case 'namespace':
				namespace = argv[++i]
				continue
			case 'f': case 'filename':
				fileName = argv[++i]
				continue
			case 'V': case 'version':
				console.log(version)
				process.exit(0)
				continue
			case 'h': case 'help':
				help()
				process.exit(0)
		}
		console.error(`unknown option: "${match[0]}"`)
		process.exit(1)
	}
	console.error(`unknown argument: "${arg}"`)
	process.exit(1)
}

if (!outputDir) {
	help()
	process.exit(1)
}

(async () => {
	try {
		await buildModuleLoader({ outputDir, namespace, fileName })
	} catch (error) {
		console.error(error)
		process.exitCode = 1
	}
})()
