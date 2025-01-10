import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow accessing the `value` property of a `BehaviorSubject` instance.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden:
        'Accessing the value property of a BehaviorSubject is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subject-value',
  create: (context) => {
    const { couldBeBehaviorSubject } = getTypeServices(context);

    return {
      'Identifier[name=/^(value|getValue)$/]': (node: es.Identifier) => {
        const parent = node.parent;

        if (!parent || !('object' in parent)) {
          return;
        }

        if (couldBeBehaviorSubject(parent.object)) {
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
