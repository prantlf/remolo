import { watch } from 'rollup'
import { green } from 'picocolors'
import { generateBundleOutput, getInputOptions, getOutputOptions, writeBundleOutput } from '../build/loader.js'

const thisDir = import.meta.dirname
const outputDir = `${thisDir}/../dist`
const outputName = 'remolo.js'

;(async () => {
	const input = getInputOptions()
  const output = getOutputOptions(`${outputDir}/${outputName}`)
	const watcher = watch({ ...input, output })
	watcher.on('event', async (event) => {
		switch (event.code) {
			case 'BUNDLE_END': {
				const { result } = event
				try {
					await generateBundleOutput(result, outputName)
					console.log(green(new Date().toLocaleString()), outputName, 'was written')
				} finally {
					result.close()
				}
			}
			break
			case 'ERROR': {
				const { frame, message } = event.error
				console.error(message)
				console.log(frame)
			}
		}
	})
})()
