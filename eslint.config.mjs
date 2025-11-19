import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['dist/*.js', 'node_modules/*'],
  },
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',

      parserOptions: {
        experimentalDecorators: true,
      },
    },

    rules: {
      '@typescript-eslint/camelcase': 0,

      'no-console': [
        'error',
        {
          allow: ['warn'],
        },
      ],
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    },
  },
];
