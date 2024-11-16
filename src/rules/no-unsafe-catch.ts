import { AST_NODE_TYPES, type TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { defaultObservable } from '../constants';
import { getTypeServices, ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [] as { observable?: string }[],
  meta: {
    docs: {
      description: 'Disallow unsafe `catchError` usage in effects and epics.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Unsafe catchError usage in effects and epics are forbidden.',
    },
    schema: [
      {
        properties: {
          observable: { type: 'string' },
        },
        type: 'object',
        description: stripIndent`
          An optional object with an optional \`observable\` property.
          The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
      },
    ],
    type: 'problem',
  },
  name: 'no-unsafe-catch',
  create: (context) => {
    const invalidOperatorsRegExp = /^(catchError)$/;

    const [config = {}] = context.options;
    const { observable = defaultObservable } = config;
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable } = getTypeServices(context);

    function isUnsafe([arg]: es.Node[]) {
      if (
        arg &&
        (arg.type === AST_NODE_TYPES.FunctionDeclaration ||
          arg.type === AST_NODE_TYPES.ArrowFunctionExpression)
      ) {
        // It's only unsafe if it receives a single function argument. If the
        // source argument is received, assume that it's used to effect a
        // resubscription to the source and that the effect won't complete.
        return arg.params.length < 2;
      }

      return false;
    }

    function checkNode(node: es.CallExpression) {
      if (!node.arguments || !couldBeObservable(node)) {
        return;
      }

      node.arguments.forEach((arg) => {
        if (
          arg.type === AST_NODE_TYPES.CallExpression &&
          arg.callee.type === AST_NODE_TYPES.Identifier
        ) {
          if (
            invalidOperatorsRegExp.test(arg.callee.name) &&
            isUnsafe(arg.arguments)
          ) {
            context.report({
              messageId: 'forbidden',
              node: arg.callee,
            });
          }
        }
      });
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]:
        checkNode,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]:
        checkNode,
    };
  },
});

export = rule;
