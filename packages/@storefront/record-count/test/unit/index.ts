import * as pkg from '../../src';
import RecordCount from '../../src/record-count';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose RecordCount', () => {
    expect(pkg.RecordCount).to.eq(RecordCount);
  });
});
