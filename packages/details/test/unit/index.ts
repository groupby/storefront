import * as pkg from '../../src';
import Details from '../../src/details';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Details', () => {
    expect(pkg.Details).to.eq(Details);
  });
});
