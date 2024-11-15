import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export = {
  plugins: ['@manbearwiz/eslint-plugin-rxjs'],
  rules: {
    '@manbearwiz/rxjs/no-async-subscribe': 'error',
    '@manbearwiz/rxjs/no-create': 'error',
    '@manbearwiz/rxjs/no-ignored-notifier': 'error',
    '@manbearwiz/rxjs/no-ignored-replay-buffer': 'error',
    '@manbearwiz/rxjs/no-ignored-takewhile-value': 'error',
    '@manbearwiz/rxjs/no-implicit-any-catch': 'error',
    '@manbearwiz/rxjs/no-index': 'error',
    '@manbearwiz/rxjs/no-internal': 'error',
    '@manbearwiz/rxjs/no-nested-subscribe': 'error',
    '@manbearwiz/rxjs/no-redundant-notify': 'error',
    '@manbearwiz/rxjs/no-sharereplay': ['error', { allowConfig: true }],
    '@manbearwiz/rxjs/no-subject-unsubscribe': 'error',
    '@manbearwiz/rxjs/no-unbound-methods': 'error',
    '@manbearwiz/rxjs/no-unsafe-subject-next': 'error',
    '@manbearwiz/rxjs/no-unsafe-takeuntil': 'error',
  },
} satisfies ClassicConfig.Config;
