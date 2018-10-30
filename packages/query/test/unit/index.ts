import * as pkg from '../../src';
import Query from '../../src/query';
import SearchBox from '../../src/search-box';
import Submit from '../../src/submit';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Query', () => {
    expect(pkg.Query).to.eq(Query);
  });

  it('should expose SearchBox', () => {
    expect(pkg.SearchBox).to.eq(SearchBox);
  });

  it('should expose Submit', () => {
    expect(pkg.Submit).to.eq(Submit);
  });
});
