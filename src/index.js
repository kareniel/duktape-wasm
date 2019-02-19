import loadWASM from '../build/duktape'
const noop = () => {}

function duktape () {
  console.log('Loading WASM Module...')

  var api = {
    _onReady: noop,
    _onRead: noop,
    on: registerHandler
  }

  loadWASM().then(Module => {
    api.start = Module.cwrap('start', 'void', [ 'number' ])
    api.eval = Module.cwrap('eval', 'string', [ 'string' ])
    api.debug = Module.cwrap('debug', 'void', [])

    var readCB = Module.addFunction(function (udataPtr, bufferPtr, length) {
      var buffer = new Array(length).fill(0).map((_, index) => {
        return Module.getValue(bufferPtr + index, '*')
      })

      api._onRead(buffer)
    })

    var writeCB = Module.addFunction(function (udataPtr, bufferPtr, length) {
      var buffer = new Array(length).fill(0).map((_, index) => {
        return Module.getValue(bufferPtr + index, '*')
      })

      api._onWrite(buffer)
    })

    api.start(readCB, writeCB)
    api._onReady()
  })

  return api
}

function registerHandler (eventName, callback) {
  if (eventName === 'ready') {
    this._onReady = callback
  }

  if (eventName === 'read') {
    this._onRead = callback
  }

  if (eventName === 'write') {
    this._onWrite = callback
  }
}

export default duktape
