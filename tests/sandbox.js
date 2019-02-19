var duktape = require('../src')

var runtime = duktape()

runtime.on('ready', () => {
  console.log(runtime.eval('"a"+"b"'))
})
