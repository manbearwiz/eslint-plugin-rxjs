import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
type MessageIds = 'forbidden';

const defaultOptions: Options = [{}];

const rule = ruleCreator<Options, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow the `toPromise` method.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'The toPromise method is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-topromise',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    return {
      [`MemberExpression[property.name="toPromise"]`]: (
        node: es.MemberExpression,
      ) => {
        if (couldBeObservable(node.object)) {
          context.report({
            messageId: 'forbidden',
            node: node.property,
          });
        }
      },
    };
  },
});

export = rule;
