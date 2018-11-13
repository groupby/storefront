import SearchTerms from '../../src/search-terms';
import suite from './_suite';

suite('SearchTerms', ({ expect, spy, itShouldProvideAlias }) => {
  let searchTerms: SearchTerms;

  beforeEach(() => (searchTerms = new SearchTerms()));

  itShouldProvideAlias(SearchTerms, 'searchTerms');

  describe('constructor()', () => {
    describe('props', () => {
      describe('onClick()', () => {
        it('should call actions.search()', () => {
          const query = 'hats';
          const search = spy();
          const handler = searchTerms.props.onClick(query);
          searchTerms.actions = <any>{ search };

          handler();

          expect(search).to.be.calledWith(query);
        });
      });
    });
  });
});
