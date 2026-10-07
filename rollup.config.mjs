import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

// eslint-disable-next-line no-undef
const dev = process.env.ROLLUP_WATCH;

const serveopts = {
  allowCrossOrigin: true,
  contentBase: ['./dist'],
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  host: '0.0.0.0',
  port: 4000,
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript(),
  json(),
  dev && serve(serveopts),
  !dev && terser(),
];

export default [
  {
    context: 'window',
    input: 'src/compass-card.ts',
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [...plugins],
    watch: {
      chokidar: {
        usePolling: true,
      },
    },
  },
];
