import { AST_NODE_TYPES, type TSESTree as es } from '@typescript-eslint/utils';

import { getTypeServices, ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow observables not composed from the `repeatWhen` or `retryWhen` notifier.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Ignoring the notifier is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-notifier',
  create: (context) => {
    const { couldBeMonoTypeOperatorFunction } = getTypeServices(context);

    type Entry = {
      node: es.Node;
      param: es.Identifier;
      sightings: number;
    };
    const entries: Entry[] = [];

    function getEntry() {
      const { length, [length - 1]: entry } = entries;
      return entry;
    }

    return {
      'CallExpression[callee.name=/^(repeatWhen|retryWhen)$/]': (
        node: es.CallExpression,
      ) => {
        if (couldBeMonoTypeOperatorFunction(node)) {
          const [arg] = node.arguments;
          if (
            arg &&
            (arg.type === AST_NODE_TYPES.ArrowFunctionExpression ||
              arg.type === AST_NODE_TYPES.FunctionExpression)
          ) {
            const [param] = arg.params as es.Identifier[];
            if (param) {
              entries.push({
                node,
                param,
                sightings: 0,
              });
            } else {
              context.report({
                messageId: 'forbidden',
                node: node.callee,
              });
            }
          }
        }
      },
      'CallExpression[callee.name=/^(repeatWhen|retryWhen)$/]:exit': (
        node: es.CallExpression,
      ) => {
        const entry = getEntry();
        if (!entry) {
          return;
        }
        if (entry.node === node) {
          if (entry.sightings < 2) {
            context.report({
              messageId: 'forbidden',
              node: node.callee,
            });
          }
          entries.pop();
        }
      },
      Identifier: (node: es.Identifier) => {
        const entry = getEntry();
        if (!entry) {
          return;
        }
        if (node.name === entry.param.name) {
          ++entry.sightings;
        }
      },
    };
  },
});

export = rule;
