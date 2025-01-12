# @rxlint/eslint-plugin-rxjs

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/manbearwiz/eslint-plugin-rxjs/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@rxlint/eslint-plugin.svg)](https://www.npmjs.com/package/@rxlint/eslint-plugin)
[![Downloads](http://img.shields.io/npm/dm/@rxlint/eslint-plugin.svg)](https://www.npmjs.com/package/@rxlint/eslint-plugin)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/manbearwiz/eslint-plugin-rxjs/release.yml)](https://github.com/manbearwiz/eslint-plugin-rxjs/actions/workflows/release.yml)

This package is a fork of the package [`cartant/eslint-plugin-rxjs`](https://github.com/cartant/eslint-plugin-rxjs) with trimmed and updated dependencies to work with both eslint 8 and 9. Angular-specific rules are in [`@rxlint/eslint-plugin-angular`](https://github.com/manbearwiz/eslint-plugin-rxjs-angular).

Some rules are opinionated and not included in the `recommended` configuration. Developers can enable them as needed. Most rules require the TypeScript parser for ESLint but there is a config provided to disable those.

## Installation

Install the required packages:

```sh
npm install --save-dev eslint typescript @typescript-eslint/parser @rxlint/eslint-plugin
# or
yarn add --dev eslint typescript @typescript-eslint/parser @rxlint/eslint-plugin
```

## Configuration

This plugin works with ESLint v8 (`eslintrc`) and v9 (`eslint.config.js`) configuration formats.

### ESLint v8 Configuration

Add `@rxlint/recommended` to your `extends` array:

`.eslintrc.js`

```js
module.exports = {
  files: ["**/*.ts"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:@rxlint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: true,
    sourceType: "module",
  },
  rules: {
    "@rxlint/no-async-subscribe": "error",
    "@rxlint/no-ignored-observable": "error",
    "@rxlint/no-ignored-subscription": "error",
    "@rxlint/no-nested-subscribe": "error",
    "@rxlint/no-unbound-methods": "error",
    "@rxlint/throw-error": "error",
  },
};
```

### ESLint v9 Configuration

Import the plugin and add it to the `extends` array:

`eslint.config.js`

```js
const rxjs = require("@rxlint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      rxjs.configs.recommendedTypeChecked,
    ],
  },
];
```

### Disable Type-Aware Linting

Use the `disable-type-checked` config to turn off type-aware linting for specific file subsets.

#### ESLint v8

Add `@rxlint/disable-type-checked-classic` to your `extends` array:

`.eslintrc.js`

```js
module.exports = {
  files: ['**/*.{config,test,spec}.{js,ts}'],
  extends: [
    "plugin:@typescript-eslint/disable-type-checked",
    "plugin:@rxlint/disable-type-checked",
  ],
};
```

#### ESLint v9

Import the plugin and add `rxjs.config.disableTypeChecked` to the `extends` array:

`eslint.config.js`

```js
module.exports = {
  files: ['**/*.{config,test,spec}.{js,ts}'],
  extends: [
    tseslint.configs.disableTypeChecked,
    rxjs.config.disableTypeChecked,
  ],
};
```

## Rules

The package includes the following rules.

Rules marked with ✅ are recommended and rules marked with 🔧 have fixers.

| Rule | Description | | |
| --- | --- | --- | --- |
| [`ban-observables`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/ban-observables.md) | Forbids the use of banned observables. | | |
| [`ban-operators`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/ban-operators.md) | Forbids the use of banned operators. | | |
| [`finnish`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/finnish.md) | Enforces the use of Finnish notation. | | |
| [`just`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/just.md) | Enforces the use of a `just` alias for `of`. | | 🔧 |
| [`no-async-subscribe`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-async-subscribe.md) | Forbids passing `async` functions to `subscribe`. | ✅ | |
| [`no-compat`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-compat.md) | Forbids importation from locations that depend upon `rxjs-compat`. | | |
| [`no-connectable`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-connectable.md) | Forbids operators that return connectable observables. | | |
| [`no-create`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-create.md) | Forbids the calling of `Observable.create`. | ✅ | |
| [`no-cyclic-action`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-cyclic-action.md) | Forbids effects and epics that re-emit filtered actions. | | |
| [`no-explicit-generics`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-explicit-generics.md) | Forbids explicit generic type arguments. | | |
| [`no-exposed-subjects`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-exposed-subjects.md) | Forbids exposed  (i.e. non-private) subjects. | | |
| [`no-finnish`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-finnish.md) | Forbids the use of Finnish notation. | | |
| [`no-ignored-error`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-error.md) | Forbids the calling of `subscribe` without specifying an error handler. | | |
| [`no-ignored-notifier`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-notifier.md) | Forbids observables not composed from the `repeatWhen` or `retryWhen` notifier. | ✅ | |
| [`no-ignored-observable`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-observable.md) | Forbids the ignoring of observables returned by functions. | | |
| [`no-ignored-replay-buffer`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-replay-buffer.md) | Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size. | ✅ | |
| [`no-ignored-subscribe`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-subscribe.md) | Forbids the calling of `subscribe` without specifying arguments. | | |
| [`no-ignored-subscription`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-subscription.md) | Forbids ignoring the subscription returned by `subscribe`. | | |
| [`no-ignored-takewhile-value`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-ignored-takewhile-value.md) | Forbids ignoring the value within `takeWhile`. | ✅ | |
| [`no-implicit-any-catch`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-implicit-any-catch.md) | Like the [`no-implicit-any-catch` rule](https://github.com/typescript-eslint/typescript-eslint/pull/2202) in `@typescript-eslint/eslint-plugin`, but for the `catchError` operator instead of `catch` clauses. | ✅ | 🔧 |
| [`no-index`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-index.md) | Forbids the importation from index modules - for the reason, see [this issue](https://github.com/ReactiveX/rxjs/issues/4230). | ✅ | |
| [`no-internal`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-internal.md) | Forbids the importation of internals. | ✅ | 🔧 |
| [`no-nested-subscribe`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-nested-subscribe.md) | Forbids the calling of `subscribe` within a `subscribe` callback. | ✅ | |
| [`no-redundant-notify`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-redundant-notify.md) | Forbids redundant notifications from completed or errored observables. | ✅ | |
| [`no-sharereplay`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-sharereplay.md) | Forbids using the `shareReplay` operator. | ✅ | |
| [`no-subclass`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-subclass.md) | Forbids subclassing RxJS classes. | | |
| [`no-subject-unsubscribe`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-subject-unsubscribe.md) | Forbids calling the `unsubscribe` method of a subject instance. | ✅ | |
| [`no-subject-value`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-subject-value.md) | Forbids accessing the `value` property of a `BehaviorSubject` instance. | | |
| [`no-subscribe-handlers`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-subscribe-handlers.md) | Forbids the passing of handlers to `subscribe`. | | |
| [`no-topromise`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-topromise.md) | Forbids the use of the `toPromise` method. | | |
| [`no-unbound-methods`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unbound-methods.md) | Forbids the passing of unbound methods. | ✅ | |
| [`no-unsafe-catch`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-catch.md) | Forbids unsafe `catchError` usage in effects and epics. | | |
| [`no-unsafe-first`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-first.md) | Forbids unsafe `first`/`take` usage in effects and epics. | | |
| [`no-unsafe-subject-next`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-subject-next.md) | Forbids unsafe optional `next` calls. | ✅ | |
| [`no-unsafe-switchmap`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-switchmap.md) | Forbids unsafe `switchMap` usage in effects and epics. | | |
| [`no-unsafe-takeuntil`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-takeuntil.md) | Forbids the application of operators after `takeUntil`. | ✅ | |
| [`prefer-observer`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/prefer-observer.md) | Forbids the passing separate handlers to `subscribe` and `tap`. | | 🔧 |
| [`suffix-subjects`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/suffix-subjects.md) | Enforces the use of a suffix in subject identifiers. | | |
| [`throw-error`](https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/throw-error.md) | Enforces the passing of `Error` values to error notifications. | | |
