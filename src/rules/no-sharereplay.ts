import type { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowConfig?: boolean;
}[] = [];

type MessageIds = 'forbidden' | 'forbiddenWithoutConfig';

export = ruleCreator<typeof defaultOptions, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Forbids using the `shareReplay` operator.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'shareReplay is forbidden.',
      forbiddenWithoutConfig:
        'shareReplay is forbidden unless a config argument is passed.',
    },
    schema: [
      {
        properties: {
          allowConfig: { type: 'boolean' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-sharereplay',
  create: (context) => {
    const [config = {}] = context.options;
    const { allowConfig = true } = config;
    return {
      "CallExpression[callee.name='shareReplay']": (
        node: es.CallExpression,
      ) => {
        let report = true;
        if (allowConfig) {
          report =
            node.arguments.length !== 1 ||
            node.arguments[0]?.type !== 'ObjectExpression';
        }
        if (report) {
          context.report({
            messageId: allowConfig ? 'forbiddenWithoutConfig' : 'forbidden',
            node: node.callee,
          });
        }
      },
    };
  },
});
