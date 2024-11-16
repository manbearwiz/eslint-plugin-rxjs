import { ESLintUtils, type TSESTree as es } from '@typescript-eslint/utils';
import { couldBeFunction, couldBeType, isAny, isUnknown } from 'tsutils-etc';
import type ts from 'typescript';
import { getTypeServices, ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Enforce passing only `Error` values to error notifications.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Passing non-Error values are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'throw-error',
  create: (context) => {
    const { esTreeNodeToTSNodeMap, program, getTypeAtLocation } =
      ESLintUtils.getParserServices(context);
    const { couldBeObservable } = getTypeServices(context);

    function checkNode(node: es.Node) {
      let type = getTypeAtLocation(node);
      if (couldBeFunction(type)) {
        const tsNode = esTreeNodeToTSNodeMap.get(node);
        const annotation = (tsNode as ts.ArrowFunction).type;
        const body = (tsNode as ts.ArrowFunction).body;
        type = program.getTypeChecker().getTypeAtLocation(annotation ?? body);
      }
      if (
        !isAny(type) &&
        !isUnknown(type) &&
        !couldBeType(type, /^(Error|DOMException)$/)
      ) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    return {
      'ThrowStatement > *': checkNode,
      "CallExpression[callee.name='throwError']": (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          const [arg] = node.arguments;
          if (arg) {
            checkNode(arg);
          }
        }
      },
    };
  },
});

export = rule;
