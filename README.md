# duktape-wasm

Evaluate javascript safely in the browser.

Planned:

- [ ] An API for Duktape's debugger
- [ ] An event loop (Probably libuv)
- [ ] setTimeout, setInterval


## Installation

Assuming `emcc` is in your PATH, `npm run build:lib` will output some js and 
wasm in the `dist` folder.


## Usage

```js
var duktape = require('duktape-wasm')

// using promises
duktape().then(runtime => {})

// using callbacks
duktape((err, runtime) => {})

```

## API

#### runtime.eval(string)

Ask Duktape to evaluate a javascript string.

