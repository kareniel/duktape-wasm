import duktape from '../src'

var runtime = duktape()

global.runtime = runtime

runtime.on('ready', () => {
  runtime.debug()
  // runtime.eval('1+1')
})
