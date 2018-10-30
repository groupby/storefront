import * as pkg from '../../src';
import Recommendations from '../../src/recommendations';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Recommendations', () => {
    expect(pkg.Recommendations).to.eq(Recommendations);
  });
});
