import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow the ignoring of observables returned by functions.',
      recommended: false,
      requiresTypeChecking: true,
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

export = rule;
