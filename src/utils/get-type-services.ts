import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
  type TSESTree as es,
} from '@typescript-eslint/utils';
import ts from 'typescript';
import { couldBeType as tsutilsEtcCouldBeType } from './could-be-type';

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends unknown[],
>(context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>) {
  const services = ESLintUtils.getParserServices(context);
  const { esTreeNodeToTSNodeMap, program, getTypeAtLocation } = services;
  const typeChecker = program.getTypeChecker();

  const couldBeType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    const type = getTypeAtLocation(node);
    return tsutilsEtcCouldBeType(
      type,
      name,
      qualified ? { ...qualified, typeChecker } : undefined,
    );
  };

  const couldReturnType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => {
    let tsTypeNode: ts.Node | undefined;
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    if (
      ts.isArrowFunction(tsNode) ||
      ts.isFunctionDeclaration(tsNode) ||
      ts.isMethodDeclaration(tsNode) ||
      ts.isFunctionExpression(tsNode)
    ) {
      tsTypeNode = tsNode.type ?? tsNode.body;
    } else if (
      ts.isCallSignatureDeclaration(tsNode) ||
      ts.isMethodSignature(tsNode)
    ) {
      tsTypeNode = tsNode.type;
    }
    return Boolean(
      tsTypeNode &&
        tsutilsEtcCouldBeType(
          typeChecker.getTypeAtLocation(tsTypeNode),
          name,
          qualified ? { ...qualified, typeChecker } : undefined,
        ),
    );
  };

  const getType = (node: es.Node) => {
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    return tsNode && typeChecker.getTypeAtLocation(tsNode);
  };

  return {
    couldBeBehaviorSubject: (node: es.Node) =>
      couldBeType(node, 'BehaviorSubject'),
    couldBeError: (node: es.Node) => couldBeType(node, 'Error'),
    couldBeFunction: (node: es.Node) => {
      if (
        node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        node.type === AST_NODE_TYPES.FunctionDeclaration
      ) {
        return true;
      }
      return (
        !!getType(node).getCallSignatures().length ||
        couldBeType(node, 'Function') ||
        couldBeType(node, 'ArrowFunction') ||
        couldBeType(node, ts.InternalSymbolName.Function)
      );
    },
    couldBeMonoTypeOperatorFunction: (node: es.Node) =>
      couldBeType(node, 'MonoTypeOperatorFunction'),
    couldBeObservable: (node: es.Node) => couldBeType(node, 'Observable'),
    couldBeSubject: (node: es.Node) => couldBeType(node, 'Subject'),
    couldBeSubscription: (node: es.Node) => couldBeType(node, 'Subscription'),
    couldBeType,
    couldReturnObservable: (node: es.Node) =>
      couldReturnType(node, 'Observable'),
    couldReturnType,
  };
}
