import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow ignoring the subscription returned by `subscribe`.',
      recommended: false,
      requiresTypeChecking: true,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Ignoring returned subscriptions is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-subscription',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      "ExpressionStatement > CallExpression > MemberExpression[property.name='subscribe']":
        (node: es.MemberExpression) => {
          if (couldBeObservable(node.object)) {
            const callExpression = node.parent as es.CallExpression;
            if (
              callExpression.arguments.length === 1 &&
              callExpression.arguments[0] &&
              couldBeType(callExpression.arguments[0], 'Subscriber')
            ) {
              return;
            }
            context.report({
              messageId: 'forbidden',
              node: node.property,
            });
          }
        },
    };
  },
});

export = rule;
