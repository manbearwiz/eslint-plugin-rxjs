import type { TSESLint } from '@typescript-eslint/utils';
import disableTypeChecked from './configs/disable-type-checked';
import disableTypeCheckedClassic from './configs/disable-type-checked-classic';
import recommended from './configs/recommended';
import recommendedClassic from './configs/recommended-classic';
import rules from './rules';

const { name, version } = require('../package.json');

const plugin = {
  configs: {} as ReturnType<typeof createConfigs>,
  meta: {
    name,
    version,
  },
  rules,
} satisfies TSESLint.FlatConfig.Plugin;

const createConfigs = (plugin: TSESLint.FlatConfig.Plugin) => ({
  'recommended-classic':
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    recommendedClassic as any as TSESLint.FlatConfig.Config,
  'disable-type-checked-classic':
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    disableTypeCheckedClassic as any as TSESLint.FlatConfig.Config,
  recommended: recommended(plugin),
  'disable-type-checked': disableTypeChecked(plugin),
});

Object.assign(plugin.configs, createConfigs(plugin));

export = plugin;
