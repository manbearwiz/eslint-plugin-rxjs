import { stripIndent } from 'common-tags';
import * as rule from '../../src/rules/macro';
import { fromFixture, ruleTester } from '../utils';

ruleTester({ types: true }).run('macro', rule, {
  valid: [
    stripIndent`
      // no macro; no RxJS
      import { foo } from "bar";
    `,
    stripIndent`
      // macro; RxJS imports
      import "babel-plugin-rxjs-tools/macro";
      import { of } from "rxjs";
    `,
    stripIndent`
      // macro; pipe
      import "babel-plugin-rxjs-tools/macro";
      import { foo, goo } from "bar";
      const hoo = foo.pipe(goo());
    `,
    stripIndent`
      // macro; subscribe
      import "babel-plugin-rxjs-tools/macro";
      import { foo } from "bar";
      foo.subscribe();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // no macro; RxJS imports
        import { of } from "rxjs";
        ~~~~~~~~~~~~~~~~~~~~~~~~~~ [macro]
      `,
      {
        output: stripIndent`
          // no macro; RxJS imports
          import "babel-plugin-rxjs-tools/macro";
          import { of } from "rxjs";
        `,
      },
    ),
    fromFixture(
      stripIndent`
        // no macro; pipe
        import { foo, goo } from "bar";
        const hoo = foo.pipe(goo());
                    ~~~~~~~~ [macro]
      `,
      {
        output: stripIndent`
          // no macro; pipe
          import "babel-plugin-rxjs-tools/macro";
          import { foo, goo } from "bar";
          const hoo = foo.pipe(goo());
        `,
      },
    ),
    fromFixture(
      stripIndent`
        // no macro; subscribe
        import { foo } from "bar";
        foo.subscribe();
        ~~~~~~~~~~~~~ [macro]
      `,
      {
        output: stripIndent`
          // no macro; subscribe
          import "babel-plugin-rxjs-tools/macro";
          import { foo } from "bar";
          foo.subscribe();
        `,
      },
    ),
  ],
});
