const isObject = obj => obj && typeof obj === 'object'
const isArray = Array.isArray

export default function mergeObjects(result, obj) {
  for (const key in obj) {
    if (key === '__proto__' || key === 'constructor') continue
    const target = result[key]
    const source = obj[key]
    if (isObject(target) && isObject(source) && !isArray(target) && !isArray(source)) {
      result[key] = mergeObjects(target, source)
    } else {
      result[key] = source
    }
  }
  return result
}
