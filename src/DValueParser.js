import { ENUMS } from './constants'

export default class DValueParser {
  constructor (buffer, format = []) {
    this.buffer = buffer
    this.format = format
    this.index = 0
    this.struct = {}
  }

  parse () {
    this.format.forEach(str => {
      var parts = str.split(' ')

      var type = parts[0]
      var name = parts[1]
      var enumKey = parts[2]

      var val

      if (type === 'int') val = this.parseInt()
      if (type === 'str') val = this.parseString()

      this.struct[name] = enumKey
        ? ENUMS[enumKey][val]
        : val
    })

    return this.struct
  }

  parseInt () {
    var n = this.buffer[this.index]

    this.index++

    return n - 0x80
  }

  parseString () {
    var length = this.buffer[this.index] - 0x60

    this.index++

    var buf = this.buffer.slice(this.index, this.index + length)
    var str = buf.toString('utf8')

    this.index += length

    return str || ''
  }
}
