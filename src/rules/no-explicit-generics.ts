import { AST_NODE_TYPES, type TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
type MessageIds = 'forbidden';

const defaultOptions: Options = [{}];

export = ruleCreator<Options, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Forbids explicit generic type arguments.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Explicit generic type arguments are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-explicit-generics',
  create: (context) => {
    function report(node: es.Node) {
      context.report({
        messageId: 'forbidden',
        node,
      });
    }

    function checkBehaviorSubjects(node: es.Node) {
      const parent = node.parent as es.NewExpression;
      const {
        arguments: [value],
      } = parent;
      if (
        value?.type === AST_NODE_TYPES.ArrayExpression ||
        value?.type === AST_NODE_TYPES.ObjectExpression
      ) {
        return;
      }
      report(node);
    }

    function checkNotifications(node: es.Node) {
      const parent = node.parent as es.NewExpression;
      const {
        arguments: [, value],
      } = parent;
      if (
        value?.type === AST_NODE_TYPES.ArrayExpression ||
        value?.type === AST_NODE_TYPES.ObjectExpression
      ) {
        return;
      }
      report(node);
    }

    return {
      "CallExpression[callee.property.name='pipe'] > CallExpression[typeArguments.params.length > 0] > Identifier":
        report,
      "NewExpression[typeArguments.params.length > 0] > Identifier[name='BehaviorSubject']":
        checkBehaviorSubjects,
      'CallExpression[typeArguments.params.length > 0] > Identifier[name=/^(from|of)$/]':
        report,
      "NewExpression[typeArguments.params.length > 0][arguments.0.value='N'] > Identifier[name='Notification']":
        checkNotifications,
    };
  },
});
