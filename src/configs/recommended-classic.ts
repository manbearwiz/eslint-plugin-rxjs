import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export = {
  plugins: ['@rxlint'],
  rules: {
    '@rxlint/no-async-subscribe': 'error',
    '@rxlint/no-create': 'error',
    '@rxlint/no-ignored-notifier': 'error',
    '@rxlint/no-ignored-replay-buffer': 'error',
    '@rxlint/no-ignored-takewhile-value': 'error',
    '@rxlint/no-implicit-any-catch': 'error',
    '@rxlint/no-index': 'error',
    '@rxlint/no-internal': 'error',
    '@rxlint/no-nested-subscribe': 'error',
    '@rxlint/no-redundant-notify': 'error',
    '@rxlint/no-sharereplay': ['error', { allowConfig: true }],
    '@rxlint/no-subject-unsubscribe': 'error',
    '@rxlint/no-unbound-methods': 'error',
    '@rxlint/no-unsafe-subject-next': 'error',
    '@rxlint/no-unsafe-takeuntil': 'error',
  },
} satisfies ClassicConfig.Config;
