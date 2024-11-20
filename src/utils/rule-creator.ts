import { ESLintUtils } from '@typescript-eslint/utils';

export interface ESLintPluginDocs {
  recommended?: boolean | string;
  suggestion?: boolean;
  requiresTypeChecking?: boolean;
}

export const ruleCreator = ESLintUtils.RuleCreator<ESLintPluginDocs>(
  (name) =>
    `https://github.com/cartant/eslint-plugin-rxjs-angular/tree/main/docs/rules/${name}.md`,
);
