import { stripIndent } from 'common-tags';
import * as rule from '../../src/rules/no-ignored-replay-buffer';
import { fromFixture, ruleTester } from '../utils';

ruleTester({ types: false }).run('no-ignored-replay-buffer', rule, {
  valid: [
    stripIndent`
      // ReplaySubject not ignored
      import { ReplaySubject } from "rxjs";

      const a = new ReplaySubject<string>(1);
      const b = new Thing(new ReplaySubject<number>(1));
    `,
    stripIndent`
      // publishReplay not ignored
      import { of } from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = of(42).pipe(publ1.type === AST_NODE_TYPES.hReplay);
    `,
    stripIndent`
      // shareReplay not ignored
      import { of } from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = of(42).pipe(shareReplay(1));
    `,
    stripIndent`
      // namespace ReplaySubject not ignored
      import * as Rx from "rxjs";

      const a = new Rx.ReplaySubject<string>(1);
      const b = new Thing(new Rx.ReplaySubject<number>(1));
    `,
    stripIndent`
      // namespace publishReplay not ignored
      import * as Rx from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(publ1.type === AST_NODE_TYPES.hReplay);
    `,
    stripIndent`
      // namespace shareReplay not ignored
      import * as Rx from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(shareReplay(1));
    `,
    stripIndent`
      // namespace class not ignored
      import * as Rx from "rxjs";

      class Mock {
        private valid: Rx.ReplaySubject<number>;
        constructor(){
          this.valid = new Rx.ReplaySubject<number>(1);
        }
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // ReplaySubject ignored
        import { ReplaySubject } from "rxjs";

        const a = new ReplaySubject<string>();
                      ~~~~~~~~~~~~~ [forbidden]
        const b = new Thing(new ReplaySubject<number>());
                                ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // publishReplay ignored
        import { of } from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = of(42).pipe(publishReplay());
                              ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // shareReplay ignored
        import { of } from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = of(42).pipe(shareReplay());
                              ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace ReplaySubject ignored
        import * as Rx from "rxjs";

        const a = new Rx.ReplaySubject<string>();
                         ~~~~~~~~~~~~~ [forbidden]
        const b = new Thing(new Rx.ReplaySubject<number>());
                                   ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace publishReplay ignored
        import * as Rx from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(publishReplay());
                                 ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace shareReplay ignored
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay());
                                 ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace class ignored
        import * as Rx from "rxjs";

        class Mock {
          private invalid: Rx.ReplaySubject<number>;
          constructor(){
            this.invalid = new Rx.ReplaySubject<number>();
                                  ~~~~~~~~~~~~~ [forbidden]
          }
        }
      `,
    ),
  ],
});
