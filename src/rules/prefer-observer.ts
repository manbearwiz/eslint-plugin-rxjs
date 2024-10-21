import {
  AST_NODE_TYPES,
  type TSESTree as es,
  type TSESLint as eslint,
} from '@typescript-eslint/utils';
import { getTypeServices, ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowNext?: boolean;
}[] = [];

type MessageIds = 'forbidden';

export = ruleCreator<typeof defaultOptions, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description:
        'Forbids the passing separate handlers to `subscribe` and `tap`.',
      recommended: false,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      forbidden:
        'Passing separate handlers is forbidden; pass an observer instead.',
    },
    schema: [
      {
        properties: {
          allowNext: { type: 'boolean' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'prefer-observer',
  create: (context) => {
    const { couldBeFunction, couldBeObservable } = getTypeServices(context);
    const [config = {}] = context.options;
    const { allowNext = true } = config;

    function checkArgs(callExpression: es.CallExpression, reportNode: es.Node) {
      const { arguments: args, callee } = callExpression;
      if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !couldBeObservable(callee.object)
      ) {
        return;
      }

      function* fix(fixer: eslint.RuleFixer) {
        const sourceCode = context.getSourceCode();
        const [nextArg, errorArg, completeArg] = args;
        const nextArgText = nextArg ? sourceCode.getText(nextArg) : '';
        const errorArgText = errorArg ? sourceCode.getText(errorArg) : '';
        const completeArgText = completeArg
          ? sourceCode.getText(completeArg)
          : '';
        let observer = '{';
        if (
          nextArgText &&
          nextArgText !== 'undefined' &&
          nextArgText !== 'null'
        ) {
          observer += ` next: ${nextArgText}${
            isValidArgText(errorArgText) || isValidArgText(completeArgText)
              ? ','
              : ''
          }`;
        }
        if (
          errorArgText &&
          errorArgText !== 'undefined' &&
          errorArgText !== 'null'
        ) {
          observer += ` error: ${errorArgText}${
            isValidArgText(completeArgText) ? ',' : ''
          }`;
        }
        if (
          completeArgText &&
          completeArgText !== 'undefined' &&
          completeArgText !== 'null'
        ) {
          observer += ` complete: ${completeArgText}`;
        }
        observer += ' }';

        yield fixer.replaceText(callExpression.arguments[0], observer);

        const [, start] = callExpression.arguments[0].range;
        const [, end] =
          callExpression.arguments[callExpression.arguments.length - 1]
            ?.range ?? [];
        yield fixer.removeRange([start, end]);
      }

      if (args.length > 1) {
        context.report({
          messageId: 'forbidden',
          node: reportNode,
          fix,
          suggest: [
            {
              messageId: 'forbidden',
              fix,
            },
          ],
        });
      } else if (args.length === 1 && !allowNext) {
        const [arg] = args;
        if (
          arg &&
          (arg.type === AST_NODE_TYPES.ArrowFunctionExpression ||
            arg.type === AST_NODE_TYPES.FunctionExpression ||
            couldBeFunction(arg))
        ) {
          context.report({
            messageId: 'forbidden',
            node: reportNode,
            fix,
            suggest: [
              {
                messageId: 'forbidden',
                fix,
              },
            ],
          });
        }
      }
    }

    return {
      "CallExpression[callee.property.name='pipe'] > CallExpression[callee.name='tap']":
        (node: es.CallExpression) => checkArgs(node, node.callee),
      "CallExpression[callee.property.name='subscribe']": (
        node: es.CallExpression,
      ) => checkArgs(node, (node.callee as es.MemberExpression).property),
    };
  },
});

function isValidArgText(argText: string) {
  return argText && argText !== 'undefined' && argText !== 'null';
}
