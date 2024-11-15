import { ESLintUtils, type TSESTree as es } from '@typescript-eslint/utils';
import { couldBeFunction, couldBeType, isAny, isUnknown } from 'tsutils-etc';
import type ts from 'typescript';
import { getTypeServices, ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
const messages = {
  forbidden: 'Passing non-Error values are forbidden.',
};
const defaultOptions: Options = [{}];

const rule = ruleCreator<Options, keyof typeof messages>({
  defaultOptions,
  meta: {
    docs: {
      description:
        'Enforces the passing of `Error` values to error notifications.',
      recommended: false,
    },
    hasSuggestions: false,
    messages,
    schema: [],
    type: 'problem',
  },
  name: 'throw-error',
  create: (context) => {
    const { esTreeNodeToTSNodeMap, program } =
      ESLintUtils.getParserServices(context);
    const { couldBeObservable, getType } = getTypeServices(context);

    function checkNode(node: es.Node) {
      let type = getType(node);
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
