import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint';

export = {
  plugins: ['@rxlint'],
  rules: {
    '@rxlint/finnish': 'off',
    '@rxlint/no-async-subscribe': 'off',
    '@rxlint/no-connectable': 'off',
    '@rxlint/no-create': 'off',
    '@rxlint/no-cyclic-action': 'off',
    '@rxlint/no-exposed-subjects': 'off',
    '@rxlint/no-finnish': 'off',
    '@rxlint/no-ignored-error': 'off',
    '@rxlint/no-ignored-notifier': 'off',
    '@rxlint/no-ignored-observable': 'off',
    '@rxlint/no-ignored-subscribe': 'off',
    '@rxlint/no-ignored-subscriptions': 'off',
    '@rxlint/no-implicit-any-catch': 'off',
    '@rxlint/no-nested-subscribe': 'off',
    '@rxlint/no-redundant-notify': 'off',
    '@rxlint/no-subclass': 'off',
    '@rxlint/no-subject-unsubscribe': 'off',
    '@rxlint/no-subject-value': 'off',
    '@rxlint/no-subscribe-handlers': 'off',
    '@rxlint/no-topromise': 'off',
    '@rxlint/no-unbound-methods': 'off',
    '@rxlint/no-unsafe-catch': 'off',
    '@rxlint/no-unsafe-first': 'off',
    '@rxlint/no-unsafe-subject-next': 'off',
    '@rxlint/no-unsafe-switchmap': 'off',
    '@rxlint/no-unsafe-takeuntil': 'off',
    '@rxlint/prefer-observer': 'off',
    '@rxlint/suffix-subjects': 'off',
    '@rxlint/throw-errors': 'off',
  },
} satisfies ClassicConfig.Config;