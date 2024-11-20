import type { Linter } from '@typescript-eslint/utils/ts-eslint';
const { name, version } = require('../package.json');

import configs from './configs';
import rules from './rules';

export = {
  configs,
  meta: {
    name,
    version,
  },
  rules,
} satisfies Linter.Plugin;
