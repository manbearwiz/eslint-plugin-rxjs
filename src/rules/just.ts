import type { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const rule = ruleCreator({
  defaultOptions: [{}] as readonly Record<string, boolean | string>[],
  meta: {
    docs: {
      description: 'Enforces the use of a `just` alias for `of`.',
      recommended: false,
    },
    fixable: 'code',
    hasSuggestions: false,
    messages: {
      forbidden: 'Use just alias.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'just',
  create: (context) => {
    return {
      "ImportDeclaration[source.value='rxjs'] > ImportSpecifier[imported.name='of']":
        (node: es.ImportSpecifier) => {
          // import declaration has been renamed
          if (
            node.local.range[0] !== node.imported.range[0] &&
            node.local.range[1] !== node.imported.range[1]
          ) {
            return;
          }

          context.report({
            messageId: 'forbidden',
            node,
            fix: (fixer) => fixer.replaceTextRange(node.range, 'of as just'),
          });

          const [ofImport] = context.sourceCode.getDeclaredVariables(node);
          ofImport?.references.forEach((ref) => {
            context.report({
              messageId: 'forbidden',
              node: ref.identifier,
              fix: (fixer) =>
                fixer.replaceTextRange(ref.identifier.range, 'just'),
            });
          });
        },
    };
  },
});

export = rule;
