import type { TSESLint } from '@typescript-eslint/utils';
import recommendedClassic from './recommended-classic';

export default (
  plugin: TSESLint.FlatConfig.Plugin,
): TSESLint.FlatConfig.ConfigArray => [
  {
    name: '@rxlint/recommended',
    plugins: {
      '@rxlint': plugin,
    },
    rules: recommendedClassic.rules,
  },
];
