import loadWASM from '../build/duktape'
import DebugProtocolParser from './DebugProtocolParser'
const noop = () => {}

function duktape () {
  console.log('Loading WASM Module...')

  var api = {
    _onReady: noop,
    _onRead: noop,
    _onWrite: noop,
    on: registerHandler,
    getBuffer: getBuffer
  }

  loadWASM().then(Module => {
    api.Module = Module
    api.start = Module.cwrap('start', 'void', [ 'number' ])
    api.eval = Module.cwrap('eval', 'string', [ 'string' ])
    api.debug = Module.cwrap('debug', 'void', [])

    var parser = new DebugProtocolParser()

    parser.on('*', (eventName, payload) => {
      console.log(eventName, payload)
    })

    var readCB = Module.addFunction(function (ptr, length) {
      var buffer = api.getBuffer(ptr, length)

      parser.write(buffer)
    })

    var writeCB = Module.addFunction(function (ptr, length) {
      var buffer = api.getBuffer(ptr, length)

      parser.write(buffer)
    })

    api.start(readCB, writeCB)
    api._onReady()
  })

  return api
}

function getBuffer (ptr, length) {
  var buffer = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    buffer[i] = this.Module.getValue(ptr + i, 'i8')
  }

  return buffer
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
