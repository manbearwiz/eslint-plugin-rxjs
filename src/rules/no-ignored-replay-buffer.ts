import { AST_NODE_TYPES, type TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.',
      recommended: 'recommended',
    },
    messages: {
      forbidden: 'Ignoring the buffer size is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-replay-buffer',
  create: (context) => {
    function checkShareReplayConfig(
      node: es.Identifier,
      shareReplayConfigArg: es.ObjectExpression,
    ) {
      if (
        !shareReplayConfigArg.properties.some(
          (p) =>
            p.type === AST_NODE_TYPES.Property &&
            p.key.type === AST_NODE_TYPES.Identifier &&
            p.key.name === 'bufferSize',
        )
      ) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    function checkNode(
      node: es.Identifier,
      { arguments: args }: es.NewExpression | es.CallExpression,
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }

      if (node.name === 'shareReplay' && args?.length === 1) {
        const arg = args[0];
        if (arg?.type === AST_NODE_TYPES.ObjectExpression) {
          checkShareReplayConfig(node, arg);
        }
      }
    }

    return {
      "NewExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier,
      ) => {
        const newExpression = node.parent as es.NewExpression;
        checkNode(node, newExpression);
      },
      "NewExpression > MemberExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier,
      ) => {
        const memberExpression = node.parent as es.MemberExpression;
        const newExpression = memberExpression.parent as es.NewExpression;
        checkNode(node, newExpression);
      },
      'CallExpression > Identifier[name=/^(publishReplay|shareReplay)$/]': (
        node: es.Identifier,
      ) => {
        const callExpression = node.parent as es.CallExpression;
        checkNode(node, callExpression);
      },
      'CallExpression > MemberExpression > Identifier[name=/^(publishReplay|shareReplay)$/]':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          const callExpression = memberExpression.parent as es.CallExpression;
          checkNode(node, callExpression);
        },
    };
  },
});

export = rule;
