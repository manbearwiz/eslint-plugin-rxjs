import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import disableTypeChecked from './configs/disable-type-checked';
import disableTypeCheckedClassic from './configs/disable-type-checked-classic';
import recommended from './configs/recommended';
import recommendedClassic from './configs/recommended-classic';
import rules from './rules';

const { name, version } = require('../package.json');

const plugin = {
  configs: {},
  meta: {
    name,
    version,
  },
  rules,
} satisfies Linter.Plugin;

Object.assign(plugin.configs, {
  'recommended-classic': recommendedClassic,
  'disable-type-checked-classic': disableTypeCheckedClassic,
  recommended: recommended(plugin),
  'disable-type-checked': disableTypeChecked(plugin),
});

export = plugin;
