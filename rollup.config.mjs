import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import ignore from './rollup-plugins/ignore.mjs';
import { ignoreTextfieldFiles } from './elements/ignore/textfield.mjs';
import { ignoreSelectFiles } from './elements/ignore/select.mjs';
import { ignoreSwitchFiles } from './elements/ignore/switch.mjs';

const dev = process.env.ROLLUP_WATCH;

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 4000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript(),
  json(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  dev && serve(serveopts),
  !dev && terser(),
  ignore({
    files: ['elements/ignore/**'],
  }),
];

export default [
  {
    input: 'src/compass-card.ts',
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [...plugins],
    context: 'window',
  },
];
