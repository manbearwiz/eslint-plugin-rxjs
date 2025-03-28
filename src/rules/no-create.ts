import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description: 'Disallow calling `Observable.create`.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Observable.create is forbidden; use new Observable.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-create',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "CallExpression > MemberExpression[object.name='Observable'] > Identifier[name='create']":
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          if (couldBeObservable(memberExpression.object)) {
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
