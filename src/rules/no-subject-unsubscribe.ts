import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow calling the `unsubscribe` method of a subject instance.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Calling unsubscribe on a subject is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subject-unsubscribe',
  create: (context) => {
    const { couldBeSubject, couldBeSubscription } = getTypeServices(context);

    return {
      "MemberExpression[property.name='unsubscribe']": (
        node: es.MemberExpression,
      ) => {
        if (couldBeSubject(node.object)) {
          context.report({
            messageId: 'forbidden',
            node: node.property,
          });
        }
      },
      "CallExpression[callee.property.name='add'][arguments.length > 0]": (
        node: es.CallExpression,
      ) => {
        const memberExpression = node.callee as es.MemberExpression;
        if (couldBeSubscription(memberExpression.object)) {
          const [arg] = node.arguments;
          if (arg && couldBeSubject(arg)) {
            context.report({
              messageId: 'forbidden',
              node: arg,
            });
          }
        }
      },
    };
  },
});

export = rule;
