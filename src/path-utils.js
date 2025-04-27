export function getDir(name) {
  const slash = name.lastIndexOf('/', name.length - 2)
  return slash >= 0 ? name.slice(0, slash + 1) : ''
}

export function resolveName(name, dir) {
  for (;;) {
    if (name.startsWith('./')) {
      name = name.slice(2)
    } else if (name.startsWith('../')) {
      name = name.slice(3)
      dir = getDir(dir)
    } else break
  }
  return dir + name
}
