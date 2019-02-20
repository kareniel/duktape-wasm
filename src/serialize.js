import { CLIENT_COMMANDS } from './constants'

export default function serialize (name, payload) {
  var command = CLIENT_COMMANDS[name]

  if (!command) throw new Error('Command ', name, ': not found.')

  var arr = [ command.code ]

  command.request = command.request || []

  command.request.forEach(item => {
    var parts = item.split(' ')

    var type = parts[0]
    var name = parts[1]

    var value = payload[name]

    if (type === 'int') value += 0x80
    if (type === 'str') value += 0x60

    arr.push(value)
  })

  arr.push(0)

  return Buffer.from(arr)
}
