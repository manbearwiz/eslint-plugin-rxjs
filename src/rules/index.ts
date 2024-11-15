import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import banObservables from './ban-observables';
import banOperators from './ban-operators';
import finnish from './finnish';
import just from './just';
import macro from './macro';
import noAsyncSubscribe from './no-async-subscribe';
import noCompat from './no-compat';
import noConnectable from './no-connectable';
import noCreate from './no-create';
import noCyclicAction from './no-cyclic-action';
import noExplicitGenerics from './no-explicit-generics';
import noExposedSubjects from './no-exposed-subjects';
import noFinnish from './no-finnish';
import noIgnoredError from './no-ignored-error';
import noIgnoredNotifier from './no-ignored-notifier';
import noIgnoredObservable from './no-ignored-observable';
import noIgnoredReplayBuffer from './no-ignored-replay-buffer';
import noIgnoredSubscribe from './no-ignored-subscribe';
import noIgnoredSubscription from './no-ignored-subscription';
import noIgnoredTakewhileValue from './no-ignored-takewhile-value';
import noImplicitAnyCatch from './no-implicit-any-catch';
import noIndex from './no-index';
import noInternal from './no-internal';
import noNestedSubscribe from './no-nested-subscribe';
import noRedundantNotify from './no-redundant-notify';
import noSharereplay from './no-sharereplay';
import noSubclass from './no-subclass';
import noSubjectUnsubscribe from './no-subject-unsubscribe';
import noSubjectValue from './no-subject-value';
import noSubscribeHandlers from './no-subscribe-handlers';
import noTap from './no-tap';
import noTopromise from './no-topromise';
import noUnboundMethods from './no-unbound-methods';
import noUnsafeCatch from './no-unsafe-catch';
import noUnsafeFirst from './no-unsafe-first';
import noUnsafeSubjectNext from './no-unsafe-subject-next';
import noUnsafeSwitchmap from './no-unsafe-switchmap';
import noUnsafeTakeuntil from './no-unsafe-takeuntil';
import preferObserver from './prefer-observer';
import suffixSubjects from './suffix-subjects';
import throwError from './throw-error';

const rules = {
  'ban-observables': banObservables,
  'ban-operators': banOperators,
  finnish: finnish,
  just: just,
  macro: macro,
  'no-async-subscribe': noAsyncSubscribe,
  'no-compat': noCompat,
  'no-connectable': noConnectable,
  'no-create': noCreate,
  'no-cyclic-action': noCyclicAction,
  'no-explicit-generics': noExplicitGenerics,
  'no-exposed-subjects': noExposedSubjects,
  'no-finnish': noFinnish,
  'no-ignored-error': noIgnoredError,
  'no-ignored-notifier': noIgnoredNotifier,
  'no-ignored-observable': noIgnoredObservable,
  'no-ignored-replay-buffer': noIgnoredReplayBuffer,
  'no-ignored-subscribe': noIgnoredSubscribe,
  'no-ignored-subscription': noIgnoredSubscription,
  'no-ignored-takewhile-value': noIgnoredTakewhileValue,
  'no-implicit-any-catch': noImplicitAnyCatch,
  'no-index': noIndex,
  'no-internal': noInternal,
  'no-nested-subscribe': noNestedSubscribe,
  'no-redundant-notify': noRedundantNotify,
  'no-sharereplay': noSharereplay,
  'no-subclass': noSubclass,
  'no-subject-unsubscribe': noSubjectUnsubscribe,
  'no-subject-value': noSubjectValue,
  'no-subscribe-handlers': noSubscribeHandlers,
  'no-tap': noTap,
  'no-topromise': noTopromise,
  'no-unbound-methods': noUnboundMethods,
  'no-unsafe-catch': noUnsafeCatch,
  'no-unsafe-first': noUnsafeFirst,
  'no-unsafe-subject-next': noUnsafeSubjectNext,
  'no-unsafe-switchmap': noUnsafeSwitchmap,
  'no-unsafe-takeuntil': noUnsafeTakeuntil,
  'prefer-observer': preferObserver,
  'suffix-subjects': suffixSubjects,
  'throw-error': throwError,
} satisfies Linter.PluginRules;

export = rules;
