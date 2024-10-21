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
        'Forbids the calling of `subscribe` within a `subscribe` callback.',
      recommended: 'error',
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Nested subscribe calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-nested-subscribe',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);
    const argumentsMap = new WeakMap<es.Node, void>();
    return {
      [`CallExpression > MemberExpression[property.name='subscribe']`]: (
        node: es.MemberExpression,
      ) => {
        if (
          !couldBeObservable(node.object) &&
          !couldBeType(node.object, 'Subscribable')
        ) {
          return;
        }
        const callExpression = node.parent as es.CallExpression;
        let parent: es.Node | undefined = callExpression.parent;
        while (parent) {
          if (argumentsMap.has(parent)) {
            context.report({
              messageId: 'forbidden',
              node: node.property,
            });
            return;
          }
          parent = parent.parent;
        }
        for (const arg of callExpression.arguments) {
          argumentsMap.set(arg);
        }
      },
    };
  },
});
