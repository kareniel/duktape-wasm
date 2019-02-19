var loadWASM = require('../build/duktape')
var noop = () => {}

function load () {
  console.log('Loading WASM Module...')

  var api = {
    _onReady: noop,
    on: function (eventName, callback) {
      if (eventName === 'ready') {
        this._onReady = callback
      }
    }
  }

  loadWASM().then(Module => {
    Module._start()

    api.eval = Module.cwrap('eval', 'string', [ 'string' ])

    api._onReady()
  })

  return api
}

module.exports = load
