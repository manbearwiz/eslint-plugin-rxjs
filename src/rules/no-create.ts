import type { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../utils';
import { ruleCreator } from '../utils';

type Options = readonly Record<string, boolean | string>[];
type MessageIds = 'forbidden';

const defaultOptions: Options = [{}];

export = ruleCreator<Options, MessageIds>({
  defaultOptions,
  meta: {
    docs: {
      description: 'Forbids the calling of `Observable.create`.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Observable.create is forbidden; use new Observable.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-create',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "CallExpression > MemberExpression[object.name='Observable'] > Identifier[name='create']":
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          if (couldBeObservable(memberExpression.object)) {
            context.report({
              messageId: 'forbidden',
              node,
            });
          }
        },
    };
  },
});
