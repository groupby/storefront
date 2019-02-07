import PastSearchTerms from '../../src/past-search-terms';
import suite from './_suite';

suite('PastSearchTerms', ({ expect, spy, itShouldProvideAlias }) => {
  let pastSearchTerms: PastSearchTerms;

  beforeEach(() => (pastSearchTerms = new PastSearchTerms()));

  itShouldProvideAlias(PastSearchTerms, 'pastSearchTerms');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(pastSearchTerms.props.label).to.be.a('string');
        expect(pastSearchTerms.props.onClick).to.be.a('function');
        expect(pastSearchTerms.props.pastSearches).to.eql([]);
      });

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
