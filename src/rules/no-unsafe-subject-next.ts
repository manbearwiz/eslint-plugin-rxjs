import { AST_NODE_TYPES, type TSESTree as es } from '@typescript-eslint/utils';
import * as tsutils from 'tsutils';
import { couldBeType, isReferenceType, isUnionType } from 'tsutils-etc';
import * as ts from 'typescript';
import { getParserServices } from '../etc';
import { getTypeServices, ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
const messages = {
  forbidden: 'Unsafe optional next calls are forbidden.',
};
const defaultOptions: Options = [{}];

const rule = ruleCreator<Options, keyof typeof messages>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Forbids unsafe optional `next` calls.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages,
    schema: [],
    type: 'problem',
  },
  name: 'no-unsafe-subject-next',
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    const { typeChecker } = getTypeServices(context);
    return {
      [`CallExpression[callee.property.name='next']`]: (
        node: es.CallExpression,
      ) => {
        if (
          node.arguments.length === 0 &&
          node.callee.type === AST_NODE_TYPES.MemberExpression
        ) {
          const type = typeChecker.getTypeAtLocation(
            esTreeNodeToTSNodeMap.get(node.callee.object),
          );
          if (isReferenceType(type) && couldBeType(type, 'Subject')) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (tsutils.isTypeFlagSet(typeArg!, ts.TypeFlags.Any)) {
              return;
            }
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (tsutils.isTypeFlagSet(typeArg!, ts.TypeFlags.Unknown)) {
              return;
            }
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (tsutils.isTypeFlagSet(typeArg!, ts.TypeFlags.Void)) {
              return;
            }
            if (
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              isUnionType(typeArg!) &&
              typeArg.types.some((t) =>
                tsutils.isTypeFlagSet(t, ts.TypeFlags.Void),
              )
            ) {
              return;
            }
            context.report({
              messageId: 'forbidden',
              node: node.callee.property,
            });
          }
        }
      },
    };
  },
});

export = rule;
