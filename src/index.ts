import type { Linter } from '@typescript-eslint/utils/ts-eslint';
const { name, version } = require('../package.json');

import rules from './rules';

export = {
  meta: {
    name,
    version,
  },
  rules,
} satisfies Linter.Plugin;
