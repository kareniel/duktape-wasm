import duktape from '../src'

var runtime = duktape()

global.runtime = runtime

runtime.on('ready', () => {
  runtime.debug()
})

runtime.on('read', function (buffer) {
  console.log('read. called from c!', buffer)
})

runtime.on('write', function (buffer) {
  console.log('write. called from c!', buffer)
})
