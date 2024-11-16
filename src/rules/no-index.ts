import type { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description: 'Disallow importing from index modules.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'RxJS imports from index modules are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-index',
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs(?:\u002f\w+)?\u002findex/]`]:
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
