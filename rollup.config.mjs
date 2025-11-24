import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { fileURLToPath } from 'url';
import ignore from './rollup-plugins/ignore.mjs';
import { ignoreSelectFiles } from './elements/ignore/select.mjs';
import { ignoreSwitchFiles } from './elements/ignore/switch.mjs';
import { ignoreTextfieldFiles } from './elements/ignore/textfield.mjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const NODE_MODULES_DIR = path.resolve(__dirname, 'node_modules');

const safeResolveModuleFiles = (filesArray) =>
  filesArray.flatMap((f) => {
    if (typeof f !== 'string') return [];
    // reject absolute paths and suspicious input
    if (path.isAbsolute(f) || f.includes('\0')) return [];
    const resolved = path.resolve(NODE_MODULES_DIR, f);
    // ensure the resolved path is inside NODE_MODULES_DIR
    if (resolved === NODE_MODULES_DIR || resolved.startsWith(NODE_MODULES_DIR + path.sep)) {
      return resolved;
    }
    // skip anything that attempts path traversal or is outside the base
    return [];
  });

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript(),
  json(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
  }),
  dev && serve(serveopts),
  !dev && terser(),
  ignore({
    files: safeResolveModuleFiles([...ignoreTextfieldFiles, ...ignoreSelectFiles, ...ignoreSwitchFiles]),
  }),
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
  },
];
