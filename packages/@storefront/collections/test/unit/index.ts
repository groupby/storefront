import * as pkg from '../../src';
import Collections from '../../src/collections';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Collections', () => {
    expect(pkg.Collections).to.eq(Collections);
  });
});
