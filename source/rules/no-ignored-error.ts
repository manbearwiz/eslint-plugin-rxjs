/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: "Best Practices",
      description:
        "Forbids the calling of `subscribe` without specifying an error handler.",
      recommended: false,
    },
    fixable: null,
    messages: {
      forbidden: "Calling subscribe without an error handler is forbidden.",
    },
    schema: null,
    type: "problem",
  },
  name: "no-ignored-error",
  create: (context) => {
    const {
      couldBeObservable,
      isReferenceType,
      couldBeFunction,
    } = getTypeServices(context);

    return {
      "CallExpression[arguments.length > 0] > MemberExpression > Identifier[name='subscribe']": (
        node: es.Identifier
      ) => {
        const memberExpression = getParent(node) as es.MemberExpression;
        const callExpression = getParent(memberExpression) as es.CallExpression;

        if (
          callExpression.arguments.length < 2 &&
          isReferenceType(memberExpression.object) &&
          couldBeObservable(memberExpression.object) &&
          couldBeFunction(callExpression.arguments[0])
        ) {
          context.report({
            messageId: "forbidden",
            node,
          });
        }
      },
    };
  },
});

export = rule;
