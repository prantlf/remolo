# Remolo - RequireJS-Compatible Module Loader

[AMD] module loader compatible with [RequireJS] for modern web browsers.

* Requires a browser supporting ES6 (ES2015).
* Depends on script loading and error reporting API.
* Reports module-loading errors precisely on the module level.
* Uses Promises internally and offers an alternative Promise-based interface.

Use [prantlf/r.js] for bundling RequireJS modules instead of the original [RequireJS optimizer], if you write modern JavaScript language. Use [requirejs-esm-preprocessor] or [requirejs-esm] if you prefer ESM syntax to AMD syntax in the source modules.

**Warning**: This is a work in progress.

## Synopsis

```js
// module: oracle.js
define({
  ask() {
    return 42
  }
})
```

```html
<!-- main page: index.html -->
<script src="node_modules/remolo/dist/remolo.min.js"></script>
<script>
  require(['oracle'], oracle => {
    const answer = oracle.ask()
    console.log(answer)
  })
</script>
```

## Installation

Use Bun, Deno or Node.js with the package manager of your choice, for example:

    npm i -D remolo

Installed files:

| File                                       | Note                                                                 |
|:-------------------------------------------|:---------------------------------------------------------------------|
| remolo/loader                              | module with functions for generating the module loader               |
| remolo-create                              | command-line script for generating a script with the module loader   |
| node_modules/remolo/dist/remolo.js         | not minified module loader declaring not namespaced global functions |
| node_modules/remolo/dist/remolo.js.map     | source map for the script above                                      |
| node_modules/remolo/dist/remolo.js.sri     | sub-resource integrity checksumfor the script above                  |
| node_modules/remolo/dist/remolo.min.js     | minified module loader declaring not namespaced global functions     |
| node_modules/remolo/dist/remolo.min.js.map | source map for the script above                                      |
| node_modules/remolo/dist/remolo.min.js.sri | sub-resource integrity checksum for the script above                 |

## Examples

Learn how to define and require modules from the examples below.

### Importing Modules

Define a module depending statically (during the loading time) on a module at `baseUrl`:

```js
// depends on: <baseUrl>/oracle.js
define(['oracle'], oracle => {
  const answer = oracle.ask()
  console.log(answer)
})
```

Define a module depending statically (during the loading time) on a module in the same directory:

```js
// depends on: ./oracle.js
define(['./oracle'], oracle => {
  const answer = oracle.ask()
  console.log(answer)
})
```

Define a module depending on another module dynamically (during the execution time):

```js
define(['require'], require => {
  // imports: ./oracle.js
  require(['./oracle'],
    oracle => {
      const answer = oracle.ask()
      console.log(answer)
    },
    err => console.warn(err))
})
```

Require a module at `baseUrl`:

```js
// imports: <baseUrl>/oracle.js
require(['oracle'], 
  oracle => {
    const answer = oracle.ask()
    console.log(answer)
  },
  err => console.warn(err))
```

Require a module using a Promise:

```js
// imports: <baseUrl>/oracle.js
const [oracle] = await require(['oracle'])
```

Require an already loaded module:

```js
// returns the export of <baseUrl>/oracle.js
const oracle = require('oracle')
```

### Exporting from Modules

Export a static object with no dependencies:

```js
// exports: { answer: 42 }
define({
  answer: 42
})
```

Export a result returned by the module callback:

```js
// exports: 42
define(() => {
  return 42
})
```

Export a named export via the `exports` pseudo-module:

```js
// exports: { answer: 42 }
define(['exports'], exports => {
  exports.answer = 42
})
```

Export a named export via the `module` pseudo-module:

```js
// exports: { answer: 42 }
define(['module'], module => {
  module.exports.answer = 42
})
```

### Configuration

Set module-loading parameters:

```js
require.config({
  baseUrl: '../dist'
  urlArgs: 'v=1'
})
```

Set module configuration:

```js
require.config({
  config: {
    'oracle': { enable: true }
  }
})
```

Require a module after setting configuration properties:

```js
require.config({
  deps: ['oracle'],
  callback(oracle) {
    const answer = oracle.ask()
    console.log(answer)
  },
  error(err) {
    console.warn(err)
  }
})
```

## Differences from RequireJS

Attribute `data-main` isn't supported. Use `require` or `require.config` to load the main application module.

Configuration parameter `waitSeconds` isn't supported. Module-loading timeout is controlled by the browser and underlying operating system.

Contexts aren't supported. Only the default context (_) is accessible for compatibility.

Packages aren't supported. Write API-exporting modules manually.

Shims aren't supported. Write AMD wrappers manually.

Simplified CommonJS wrapping isn't supported:

    define(function (require, exports, module) {
      ...
    })

Use the AMDJS syntax:

    define(['require', 'exports', 'module'], function (require, exports, module) {
      ...
    })

## Development

Prepare the development environment, which uses Bun:

    bun i

Build and test:

    bun run build
    bun run test

Start the build watcher and development server:

    bun run watch &
    bun run start

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2025 Ferdinand Prantl

Licensed under the MIT license.

[AMD]: https://github.com/amdjs/amdjs-api?tab=readme-ov-file
[RequireJS]: http://requirejs.org
[RequireJS optimizer]: https://requirejs.org/docs/optimization.html
[requirejs-esm-preprocessor]: https://www.npmjs.com/package/requirejs-esm-preprocessor
[requirejs-esm]: https://www.npmjs.com/package/requirejs-esm
[prantlf/r.js]: https://github.com/prantlf/r.js
