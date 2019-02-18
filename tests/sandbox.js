var duktape = require('../src')

main()

async function main () {
  var runtime = await duktape()

  console.log(runtime.eval(''))
}
