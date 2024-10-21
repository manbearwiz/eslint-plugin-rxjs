import { stripIndent } from 'common-tags';
import * as rule from '../../src/rules/no-create';
import { fromFixture, ruleTester } from '../utils';

ruleTester({ types: true }).run('no-create', rule, {
  valid: [],
  invalid: [
    fromFixture(
      stripIndent`
        // create
        import { Observable, Observer } from "rxjs";

        const ob = Observable.create((observer: Observer<string>) => {
                              ~~~~~~ [forbidden]
            observer.next("Hello, world.");
            observer.complete();
            return () => {};
        });
      `,
    ),
  ],
});
