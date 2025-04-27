import { buildModuleLoader } from '../build/loader.js'

const thisDir = import.meta.dirname
const outputDir = `${thisDir}/../dist`

buildModuleLoader({ outputDir })
