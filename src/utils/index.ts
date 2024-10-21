export * from './rule-creator';
export * from './get-type-services';

export function createRegExpForWords(
  config: string | string[],
): RegExp | undefined {
  if (!config || !config.length) {
    return undefined;
  }
  const flags = 'i';
  if (typeof config === 'string') {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join('|');
  return new RegExp(`(${joined})`, flags);
}

export interface ESLintPluginDocs {
  recommended?: boolean | string;
  suggestion?: boolean;
}
