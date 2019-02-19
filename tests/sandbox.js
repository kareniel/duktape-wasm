import duktape from '../src'

var runtime = duktape()

runtime.on('ready', () => {
  console.log(runtime.eval('"a"+"b"'))
})
