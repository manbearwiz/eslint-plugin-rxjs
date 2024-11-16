import type { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description:
        'Disallow importation from locations that depend upon `rxjs-compat`.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: "'rxjs-compat'-dependent import locations are forbidden.",
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-compat',
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002f/]:not(Literal[value=/^rxjs\u002f(ajax|fetch|operators|testing|webSocket)/])`]:
        (node: es.Literal) => {
          context.report({
            messageId: 'forbidden',
            node,
          });
        },
    };
  },
});

export = rule;
