import {
  AST_NODE_TYPES,
  type TSESTree as es,
  type TSESLint as eslint,
} from '@typescript-eslint/utils';
import { getTypeServices, ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow redundant notifications from completed or errored observables.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Redundant notifications are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-redundant-notify',
  create: (context) => {
    const sourceCode = context.sourceCode;
    const { couldBeType } = getTypeServices(context);
    return {
      'ExpressionStatement[expression.callee.property.name=/^(complete|error)$/] + ExpressionStatement[expression.callee.property.name=/^(next|complete|error)$/]':
        (node: es.ExpressionStatement) => {
          const parent = node.parent;
          if (!parent) {
            return;
          }
          if (
            parent.type !== AST_NODE_TYPES.BlockStatement &&
            parent.type !== AST_NODE_TYPES.Program
          ) {
            return;
          }
          const { body } = parent;
          const index = body.indexOf(node);
          const sibling = body[index - 1] as es.ExpressionStatement;
          if (
            getExpressionText(sibling, sourceCode) !==
            getExpressionText(node, sourceCode)
          ) {
            return;
          }
          if (
            !isExpressionObserver(sibling, couldBeType) ||
            !isExpressionObserver(node, couldBeType)
          ) {
            return;
          }
          const { expression } = node;
          if (expression.type === AST_NODE_TYPES.CallExpression) {
            const { callee } = expression;
            if (callee.type === AST_NODE_TYPES.MemberExpression) {
              const { property } = callee;
              if (property.type === AST_NODE_TYPES.Identifier) {
                context.report({
                  messageId: 'forbidden',
                  node: property,
                });
              }
            }
          }
        },
    };
  },
});

function getExpressionText(
  expressionStatement: es.ExpressionStatement,
  sourceCode: eslint.SourceCode,
): string | undefined {
  if (expressionStatement.expression.type !== AST_NODE_TYPES.CallExpression) {
    return undefined;
  }
  const callExpression = expressionStatement.expression;
  if (callExpression.callee.type !== AST_NODE_TYPES.MemberExpression) {
    return undefined;
  }
  const { object } = callExpression.callee;
  return sourceCode.getText(object);
}

function isExpressionObserver(
  expressionStatement: es.ExpressionStatement,
  couldBeType: (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => boolean,
): boolean {
  if (expressionStatement.expression.type !== AST_NODE_TYPES.CallExpression) {
    return false;
  }
  const callExpression = expressionStatement.expression;
  if (callExpression.callee.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }
  const { object } = callExpression.callee;
  return couldBeType(object, /^(Subject|Subscriber)$/);
}

export = rule;
