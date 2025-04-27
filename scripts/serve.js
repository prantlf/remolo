const thisDir = import.meta.dirname

Bun.serve({
  port: 3000,
  fetch(req) {
    const relativePath = new URL(req.url).pathname
    const absolutePath = `${thisDir}/..${relativePath}`
    const file = Bun.file(absolutePath)
    return new Response(file)
  },
  error() {
    return new Response(null, { status: 404 })
  }
})
