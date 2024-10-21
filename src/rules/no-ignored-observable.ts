import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
type MessageIds = 'forbidden';

const defaultOptions: Options = [{}];

export = ruleCreator<Options, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Forbids the ignoring of observables returned by functions.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Ignoring a returned Observable is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-observable',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      'ExpressionStatement > CallExpression': (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          context.report({
            messageId: 'forbidden',
            node,
          });
        }
      },
    };
  },
});
