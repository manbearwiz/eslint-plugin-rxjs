import type { TSESTree as es } from '@typescript-eslint/utils';

type Predicate = (type: string) => 'break' | 'continue' | 'return';

export function findParent(
  node: es.Node,
  ...types: string[]
): es.Node | undefined;

export function findParent(
  node: es.Node,
  predicate: Predicate,
): es.Node | undefined;

export function findParent(
  node: es.Node,
  ...args: (string | Predicate)[]
): es.Node | undefined {
  const [arg] = args;
  const predicate: Predicate =
    typeof arg === 'function'
      ? arg
      : (type) => (args.indexOf(type) === -1 ? 'continue' : 'return');
  let parent = node.parent;
  while (parent) {
    switch (predicate(parent.type)) {
      case 'break':
        return undefined;
      case 'return':
        return parent;
      default:
        break;
    }
    parent = parent.parent;
  }
  return undefined;
}
