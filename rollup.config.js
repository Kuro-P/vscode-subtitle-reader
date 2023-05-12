import nodeResolve from '@rollup/plugin-node-resolve';
import typescriptPlugin from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import commonjs from '@rollup/plugin-commonjs';

const terserPlugin = terser({
  ecma: 9,
  toplevel: true,
  mangle: false, // keep output readable
  compress: {
    booleans_as_integers: true,
    // unsafe: true,
  },
  output: {
    inline_script: false,
  },
});

export default {
  input: {
    extension: 'src/extension.ts',
    main: 'src/assets/main.ts'
  },
  output: {
    dir: './out',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    scss({
      fileName: 'main.css'
    }),
    nodeResolve(),
    commonjs({
      ignore: [ 'bufferutil', 'utf-8-validate' ], // optional dependencies of ws
    }),
    typescriptPlugin({
      tsconfig: './tsconfig.json',
    }),
  ]
};
