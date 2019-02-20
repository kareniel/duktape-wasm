import nanobus from 'nanobus'
import loadWASM from '../build/duktape'
import DebugProtocolParser from './DebugProtocolParser'
import serialize from './serialize'
import { NOTIFICATIONS, CLIENT_COMMANDS } from './constants'

function duktape () {
  if (!(this instanceof duktape)) return new duktape()

  var emitter = nanobus()
  var parser = new DebugProtocolParser()

  this.api = {}
  this.emit = emitter.emit.bind(emitter)
  this.on = emitter.on.bind(emitter)
  this.Module = null
  this.parser = parser

  this.registerListeners()

  loadWASM().then(this.onModuleReady.bind(this))

  return this
}

duktape.prototype.registerListeners = function () {
  Object.keys(CLIENT_COMMANDS).forEach(key => {
    var eventName = 'request:' + key

    this.on(eventName, payload => {
      var cmd = eventName.split(':').slice(1).join('')
      var buffer = serialize(cmd, payload)
    })
  })

  Object.values(NOTIFICATIONS).forEach(({ type }) => {
    var eventName = 'notification:' + type

    this.parser.on(eventName, payload => {
      console.log(eventName, payload)
    })
  })
}

var iter = [0x00, 0x11, 0x1]

duktape.prototype.onModuleReady = function (Module) {
  this.Module = Module

  this.api.start = Module.cwrap('start', 'void', [ 'number' ])
  this.api.eval = Module.cwrap('eval', 'string', [ 'string' ])
  this.api.debug = Module.cwrap('debug', 'void', [])

  var readCB = Module.addFunction((ptr, length) => {
    console.log('trying to read at:', ptr, length)

    var x = iter.pop()

    this.Module.setValue(ptr, x, 'i8')
    console.log(this.getBufferAt(ptr, length))
  })

  var writeCB = Module.addFunction((ptr, length) => {
    var buffer = this.getBufferAt(ptr, length)

    this.parser.write(buffer)
  })

  var peekCB = Module.addFunction(() => {
    console.log('duktape is peeking!')
  })

  this.api.start(readCB, writeCB, peekCB)
  this.emit('ready')
}

duktape.prototype.getBufferAt = function (ptr, length) {
  var buffer = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    buffer[i] = this.Module.getValue(ptr + i, 'i8')
  }

  return buffer
}

export default duktape
