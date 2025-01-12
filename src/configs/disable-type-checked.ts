import type { TSESLint } from '@typescript-eslint/utils';
import disableTypeCheckedClassic from './disable-type-checked-classic';

export default (
  plugin: TSESLint.FlatConfig.Plugin,
): TSESLint.FlatConfig.ConfigArray => [
  {
    name: '@rxlint/disable-type-checked',
    plugins: {
      '@rxlint': plugin,
    },
    rules: disableTypeCheckedClassic.rules,
    languageOptions: {
      parserOptions: { program: null, project: false, projectService: false },
    },
  },
];
