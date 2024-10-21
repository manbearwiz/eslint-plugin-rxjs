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
      description:
        'Forbids the calling of `subscribe` without specifying an error handler.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Calling subscribe without an error handler is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-error',
  create: (context) => {
    const { couldBeObservable, couldBeFunction } = getTypeServices(context);

    return {
      "CallExpression[arguments.length > 0] > MemberExpression > Identifier[name='subscribe']":
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          const callExpression = memberExpression.parent as es.CallExpression;

          if (
            callExpression.arguments.length < 2 &&
            couldBeObservable(memberExpression.object) &&
            callExpression.arguments[0] &&
            couldBeFunction(callExpression.arguments[0])
          ) {
            context.report({
              messageId: 'forbidden',
              node,
            });
          }
        },
    };
  },
});
