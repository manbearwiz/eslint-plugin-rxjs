// import fs from 'node:fs';
import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import configs from './configs';
import rules from './rules';

// const pkg = JSON.parse(fs.readFileSync(new URL('../package.json'), 'utf8'));

export = {
  // meta: {
  //   name: pkg.name,
  //   version: pkg.version,
  // },
  configs,
  rules,
} satisfies Linter.Plugin;
