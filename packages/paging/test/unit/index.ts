import * as pkg from '../../src';
import Paging from '../../src/paging';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Paging', () => {
    expect(pkg.Paging).to.eq(Paging);
  });
});
