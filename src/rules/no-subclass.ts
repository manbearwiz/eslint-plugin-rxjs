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
      description: 'Forbids subclassing RxJS classes.',
      recommended: false,
    },
    hasSuggestions: false,
    messages: {
      forbidden: 'Subclassing RxJS classes is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subclass',
  create: (context) => {
    const { couldBeType } = getTypeServices(context);

    const queryNames = [
      'AsyncSubject',
      'BehaviorSubject',
      'Observable',
      'ReplaySubject',
      'Scheduler',
      'Subject',
      'Subscriber',
    ];

    return {
      [`ClassDeclaration[superClass.name=/^(${queryNames.join(
        '|',
      )})$/] > Identifier.superClass`]: (node: es.Identifier) => {
        if (
          queryNames.some((name) =>
            couldBeType(node, name, { name: /[/\\]rxjs[/\\]/ }),
          )
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

export = rule;
