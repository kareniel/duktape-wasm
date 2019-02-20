import duktape from '../src'

var runtime = duktape()

console.log('Loading WASM Module...')

global.runtime = runtime

runtime.on('ready', () => {
  console.log('runtime ready')

  runtime.api.debug()
})
