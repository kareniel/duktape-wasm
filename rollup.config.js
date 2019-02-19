import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-builtins'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'duktapeWASM',
      file: pkg.main,
      format: 'umd'
    },
    plugins: [
      babel({
        exclude: ['node_modules/**']
      }),
      node(),
      commonjs({
        sourceMap: false
      })
    ]
  }
]
