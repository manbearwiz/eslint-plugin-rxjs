import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree as es,
} from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import ts from 'typescript';
import { defaultObservable } from '../constants';
import { ruleCreator } from '../utils';

function isTypeReference(type: ts.Type): type is ts.TypeReference {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return Boolean((type as any).target);
}

const rule = ruleCreator({
  defaultOptions: [] as { observable?: string }[],
  meta: {
    docs: {
      description: 'Disallow cyclic actions in effects and epics.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden:
        'Effects and epics that re-emit filtered actions are forbidden.',
    },
    schema: [
      {
        properties: {
          observable: {
            type: 'string',
            description:
              "A RegExp that matches an effect or epic's actions observable.",
            default: defaultObservable,
          },
        },
        type: 'object',
        description: stripIndent`
          An optional object with an optional \`observable\` property.
          The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
      },
    ],
    type: 'problem',
  },
  name: 'no-cyclic-action',
  create: (context) => {
    const [config = {}] = context.options;
    const { observable = defaultObservable } = config;
    const observableRegExp = new RegExp(observable);

    const { getTypeAtLocation, program } =
      ESLintUtils.getParserServices(context);
    const typeChecker = program.getTypeChecker();

    function checkNode(pipeCallExpression: es.CallExpression) {
      const operatorCallExpression = pipeCallExpression.arguments.find(
        (arg) =>
          arg.type === AST_NODE_TYPES.CallExpression &&
          arg.callee.type === AST_NODE_TYPES.Identifier &&
          arg.callee.name === 'ofType',
      );
      if (!operatorCallExpression) {
        return;
      }
      const operatorType = getTypeAtLocation(operatorCallExpression);
      const [signature] = typeChecker.getSignaturesOfType(
        operatorType,
        ts.SignatureKind.Call,
      );
      if (!signature) {
        return;
      }
      const operatorReturnType =
        typeChecker.getReturnTypeOfSignature(signature);
      if (!isTypeReference(operatorReturnType)) {
        return;
      }
      const [operatorElementType] =
        typeChecker.getTypeArguments(operatorReturnType);
      if (!operatorElementType) {
        return;
      }

      const pipeType = getTypeAtLocation(pipeCallExpression);
      if (!isTypeReference(pipeType)) {
        return;
      }
      const [pipeElementType] = typeChecker.getTypeArguments(pipeType);
      if (!pipeElementType) {
        return;
      }

      const operatorActionTypes = getActionTypes(operatorElementType);
      const pipeActionTypes = getActionTypes(pipeElementType);
      for (const actionType of operatorActionTypes) {
        if (pipeActionTypes.includes(actionType)) {
          context.report({
            messageId: 'forbidden',
            node: pipeCallExpression.callee,
          });
          return;
        }
      }
    }

    function getActionTypes(type: ts.Type): string[] {
      if (type.isUnion()) {
        const memberActionTypes: string[] = [];
        for (const memberType of type.types) {
          memberActionTypes.push(...getActionTypes(memberType));
        }
        return memberActionTypes;
      }
      const symbol = typeChecker.getPropertyOfType(type, 'type');
      if (!symbol?.valueDeclaration) {
        return [];
      }
      const actionType = typeChecker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      );
      return [typeChecker.typeToString(actionType)];
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]:
        checkNode,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]:
        checkNode,
    };
  },
});

export = rule;
