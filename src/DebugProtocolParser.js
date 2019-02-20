import Nanobus from 'nanobus'
import DValueParser from './DValueParser'
import { NOTIFICATIONS } from './constants'

export default class DebugProtocolParser extends Nanobus {
  constructor () {
    super()

    this.buffer = new Buffer(0)
  }

  write (buffer) {
    if (!this.versionString) return this.handleVersionString(buffer)

    this.buffer = Buffer.concat([ this.buffer, buffer ])

    if (this.buffer[this.buffer.length - 1] === 0) {
      this.parse(this.buffer)

      this.buffer = new Buffer(0)
    }
  }

  parse (buffer) {
    var type = buffer[0]
    var copy = Buffer.from(buffer).slice(1, -1)

    if (type === 0x00) return
    if (type === 0x01) return this.handleRequest(copy)
    if (type === 0x02) return this.handleSuccessResponse(copy)
    if (type === 0x03) return this.handleErrorResponse(copy)
    if (type === 0x04) return this.handleNotification(copy)

    console.warn('parser: cannot handle this buffer', buffer)
  }

  handleVersionString (buffer) {
    this.versionString = Buffer.from(buffer).toString('utf8')
    console.log('Version String:', this.versionString)
  }

  handleRequest (buffer) {
    console.log('Request:', buffer)
  }

  handleSuccessResponse (buffer) {
    console.log('SuccessResponse:', buffer)
  }

  handleErrorResponse (buffer) {
    console.log('ErrorResponse:', buffer)
  }

  handleNotification (buffer) {
    var id = buffer[0] - 0x80
    var { type, format } = NOTIFICATIONS[id]

    var buf = Buffer.from(buffer.slice(1))
    var parser = new DValueParser(buf, format)

    this.emit('notification:' + type, parser.parse())
  }
}

