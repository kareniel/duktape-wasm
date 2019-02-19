# duktape-wasm

Bindings to [Duktape](https://github.com/svaarala/duktape) in the browser.

Planned:

- [ ] An API for Duktape's debugger
- [ ] An event loop (Probably libuv)
- [ ] setTimeout, setInterval


## Usage

```js
var duktape = require('duktape-wasm')

var runtime = duktape()

runtime.on('ready', () => {
  runtime.eval('var a = 1;')
})

```

## API

#### runtime.on(eventName)

Register an event listener.

- `ready`: Called when the wasm module has finished loading. 

#### runtime.eval(string)

Ask Duktape to evaluate a javascript string.

