import PastSearchTerms from '../../src/past-search-terms';
import suite from './_suite';

suite('PastSearchTerms', ({ expect, spy, itShouldProvideAlias }) => {
  let pastSearchTerms: PastSearchTerms;

  beforeEach(() => (pastSearchTerms = new PastSearchTerms()));

  itShouldProvideAlias(PastSearchTerms, 'pastSearchTerms');

  describe('constructor()', () => {
    describe('props', () => {
      describe('onClick()', () => {
        it('should call actions.search()', () => {
          const query = 'hats';
          const search = spy();
          const handler = pastSearchTerms.props.onClick(query);
          pastSearchTerms.actions = <any>{ search };

          handler();

          expect(search).to.be.calledWith(query);
        });
      });
    });
  });
});
