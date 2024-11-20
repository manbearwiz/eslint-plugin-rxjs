import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree as es,
} from '@typescript-eslint/utils';
import { getTypeServices, ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description: 'Disallow passing unbound methods.',
      recommended: 'error',
      requiresTypeChecking: true,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Unbound methods are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-unbound-methods',
  create: (context) => {
    const { getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable, couldBeSubscription } = getTypeServices(context);
    const nodeMap = new WeakMap<es.Node, void>();

    function mapArguments(node: es.CallExpression | es.NewExpression) {
      node.arguments
        .filter((a) => a.type === AST_NODE_TYPES.MemberExpression)
        .forEach((arg) => {
          const argType = getTypeAtLocation(arg);
          if (argType.getCallSignatures().length > 0) {
            nodeMap.set(arg);
          }
        });
    }

    function isObservableOrSubscription(
      node: es.CallExpression,
      action: (node: es.CallExpression) => void,
    ) {
      if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
        return;
      }

      if (
        couldBeObservable(node.callee.object) ||
        couldBeSubscription(node.callee.object)
      ) {
        action(node);
      }
    }

    return {
      "CallExpression[callee.property.name='pipe']": (
        node: es.CallExpression,
      ) => {
        isObservableOrSubscription(node, ({ arguments: args }) => {
          args
            .filter((a) => a.type === AST_NODE_TYPES.CallExpression)
            .forEach(mapArguments);
        });
      },
      'CallExpression[callee.property.name=/^(add|subscribe)$/]': (
        node: es.CallExpression,
      ) => {
        isObservableOrSubscription(node, mapArguments);
      },
      "NewExpression[callee.name='Subscription']": mapArguments,
      ThisExpression: (node: es.ThisExpression) => {
        let parent: es.Node | undefined = node.parent;
        while (parent) {
          if (nodeMap.has(parent)) {
            context.report({
              messageId: 'forbidden',
              node: parent,
            });
            return;
          }
          parent = parent.parent;
        }
      },
    };
  },
});

export = rule;
