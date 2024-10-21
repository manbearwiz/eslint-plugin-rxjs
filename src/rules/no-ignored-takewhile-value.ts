import { AST_NODE_TYPES, type TSESTree as es } from '@typescript-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
type MessageIds = 'forbidden';

const defaultOptions: Options = [{}];

export = ruleCreator<Options, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Forbids ignoring the value within `takeWhile`.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Ignoring the value within takeWhile is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-takewhile-value',
  create: (context) => {
    function checkNode(
      expression: es.ArrowFunctionExpression | es.FunctionExpression,
    ) {
      const scope = context.sourceCode.getScope(expression);
      if (!isImport(scope, 'takeWhile', /^rxjs\/?/)) {
        return;
      }
      let ignored = true;
      const [param] = expression.params;
      if (param) {
        if (param.type === AST_NODE_TYPES.Identifier) {
          const variable = scope.variables.find(
            ({ name }) => name === param.name,
          );
          if (variable && variable.references.length > 0) {
            ignored = false;
          }
        } else if (param.type === AST_NODE_TYPES.ArrayPattern) {
          ignored = false;
        } else if (param.type === AST_NODE_TYPES.ObjectPattern) {
          ignored = false;
        }
      }
      if (ignored) {
        context.report({
          messageId: 'forbidden',
          node: expression,
        });
      }
    }

    return {
      "CallExpression[callee.name='takeWhile'] > ArrowFunctionExpression": (
        node: es.ArrowFunctionExpression,
      ) => checkNode(node),
      "CallExpression[callee.name='takeWhile'] > FunctionExpression": (
        node: es.FunctionExpression,
      ) => checkNode(node),
    };
  },
});

function isImport(
  scope: TSESLint.Scope.Scope,
  name: string,
  source: string | RegExp,
): boolean {
  const variable = scope.variables.find((variable) => variable.name === name);
  if (variable) {
    return variable.defs.some(
      (def) =>
        def.type === 'ImportBinding' &&
        def.parent.type === 'ImportDeclaration' &&
        (typeof source === 'string'
          ? def.parent.source.value === source
          : source.test(def.parent.source.value as string)),
    );
  }
  return scope.upper ? isImport(scope.upper, name, source) : false;
}
