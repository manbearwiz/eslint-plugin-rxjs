import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';
import disableTypeChecked from './disable-type-checked';
import recommended from './recommended';

export = {
  recommended: recommended,
  'disable-type-checked': disableTypeChecked,
} satisfies Record<string, ClassicConfig.Config>;
