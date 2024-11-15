import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';
import recommended from './recommended';

const rules = {
  recommended: recommended,
} satisfies Record<string, ClassicConfig.Config>;

export = rules;
