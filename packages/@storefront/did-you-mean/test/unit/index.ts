import * as pkg from '../../src';
import DidYouMean from '../../src/did-you-mean';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose DidYouMean', () => {
    expect(pkg.DidYouMean).to.eq(DidYouMean);
  });
});
