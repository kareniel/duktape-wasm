var loadWASM = require('../dist/duktape')
var noop = () => {}

function duktape (Module) {
  Module._start()

  var api = {
    eval: Module.cwrap('eval', 'string', [ 'string' ])
  }

  return api
}

function load (callback = noop) {
  console.log('Loading WASM Module...')

  return new Promise(resolve => {
    loadWASM().then(handleSuccess)

    function handleSuccess (Module) {
      var api = duktape(Module)

      resolve(api)
      callback(null, api)
    }
  })
}

module.exports = load
