import { stripIndent } from 'common-tags';
import * as rule from '../../src/rules/no-subject-value';
import { fromFixture, ruleTester } from '../utils';

ruleTester({ types: true }).run('no-subject-value', rule, {
  valid: [
    stripIndent`
      // no value
      import { BehaviorSubject } from "rxjs";
      const subject = new BehaviorSubject<number>(1);
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // value property
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.value);
                            ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // getValue method
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.getValue());
                            ~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
