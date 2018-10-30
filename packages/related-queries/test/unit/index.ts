import * as pkg from '../../src';
import RelatedQueries from '../../src/related-queries';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose RelatedQueries', () => {
    expect(pkg.RelatedQueries).to.eq(RelatedQueries);
  });
});
