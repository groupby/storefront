import * as pkg from '../../src';
import PageSize from '../../src/page-size';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose PageSize', () => {
    expect(pkg.PageSize).to.eq(PageSize);
  });
});
