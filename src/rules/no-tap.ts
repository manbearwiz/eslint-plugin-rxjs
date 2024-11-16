import type { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    deprecated: true,
    docs: {
      description: 'Disallow the `tap` operator.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'The tap operator is forbidden.',
    },
    replacedBy: ['ban-operators'],
    schema: [],
    type: 'problem',
  },
  name: 'no-tap',
  create: (context) => {
    return {
      [String.raw`ImportDeclaration[source.value=/^rxjs(\u002foperators)?$/] > ImportSpecifier[imported.name='tap']`]:
        (node: es.ImportSpecifier) => {
          const { loc } = node;
          context.report({
            messageId: 'forbidden',
            loc: {
              ...loc,
              end: {
                ...loc.start,
                column: loc.start.column + 3,
              },
            },
          });
        },
    };
  },
});

export = rule;
