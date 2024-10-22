import type {
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
const messages = {
  macro: 'Use the RxJS Tools Babel macro.',
};
const defaultOptions: Options = [{}];

const rule = ruleCreator<Options, keyof typeof messages>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Enforces the use of the RxJS Tools Babel macro.',
      recommended: false,
    },
    fixable: 'code',
    hasSuggestions: false,
    messages,
    schema: [],
    type: 'problem',
  },
  name: 'macro',
  create: (context) => {
    let hasFailure = false;
    let hasMacroImport = false;
    let program: es.Program | undefined = undefined;

    function fix(fixer: eslint.RuleFixer) {
      return fixer.insertTextBefore(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        program!,
        `import "babel-plugin-rxjs-tools/macro";\n`,
      );
    }

    return {
      'CallExpression[callee.property.name=/^(pipe|subscribe)$/]': (
        node: es.CallExpression,
      ) => {
        if (hasFailure || hasMacroImport) {
          return;
        }
        hasFailure = true;
        context.report({
          fix,
          messageId: 'macro',
          node: node.callee,
        });
      },
      "ImportDeclaration[source.value='babel-plugin-rxjs-tools/macro']": () => {
        hasMacroImport = true;
      },
      [String.raw`ImportDeclaration[source.value=/^rxjs(\u002f|$)/]`]: (
        node: es.ImportDeclaration,
      ) => {
        if (hasFailure || hasMacroImport) {
          return;
        }
        hasFailure = true;
        context.report({
          fix,
          messageId: 'macro',
          node,
        });
      },
      Program: (node: es.Program) => {
        program = node;
      },
    };
  },
});

export = rule;
