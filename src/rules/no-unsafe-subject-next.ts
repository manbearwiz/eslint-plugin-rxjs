import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree as es,
} from '@typescript-eslint/utils';
import { isTypeFlagSet, isTypeReference, isUnionType } from 'ts-api-utils';
import ts from 'typescript';
import { couldBeType, ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description: 'Disallow unsafe optional `next` calls.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Unsafe optional next calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-unsafe-subject-next',
  create: (context) => {
    const { getTypeAtLocation, program } =
      ESLintUtils.getParserServices(context);
    const typeChecker = program.getTypeChecker();
    return {
      [`CallExpression[callee.property.name='next']`]: (
        node: es.CallExpression,
      ) => {
        if (
          node.arguments.length === 0 &&
          node.callee.type === AST_NODE_TYPES.MemberExpression
        ) {
          const type = getTypeAtLocation(node.callee.object);
          if (isTypeReference(type) && couldBeType(type, 'Subject')) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (isTypeFlagSet(typeArg!, ts.TypeFlags.Any)) {
              return;
            }
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (isTypeFlagSet(typeArg!, ts.TypeFlags.Unknown)) {
              return;
            }
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (isTypeFlagSet(typeArg!, ts.TypeFlags.Void)) {
              return;
            }
            if (
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              isUnionType(typeArg!) &&
              typeArg.types.some((t) => isTypeFlagSet(t, ts.TypeFlags.Void))
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
