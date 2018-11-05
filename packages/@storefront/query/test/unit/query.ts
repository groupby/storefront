import Query from '../../src/query';
import suite from './_suite';

suite('Query', ({ expect, spy, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let query: Query;

  beforeEach(() => (query = new Query()));

  itShouldBeConfigurable(Query);
  itShouldProvideAlias(Query, 'query');

  describe('constructor()', () => {
    it('should set initial values', () => {
      expect(query.registered).to.eql([]);
    });

    describe('props', () => {
      it('should set initial value', () => {
        expect(query.props).to.eql({ mode: 'default', showSayt: true });
      });
    });

    describe('state()', () => {
      describe('submit()', () => {
        it('should call actions.search() with the value of the first registered search-box', () => {
          const value = 'high tops';
          const search = spy();
          query.actions = <any>{ search };
          query.registered = <any[]>[{ refs: { searchBox: { value } } }];

          query.state.submit();

          expect(search).to.be.calledWith(value);
        });

        it('should not call actions.search() if no registered search-box', () => {
          const search = spy();
          query.actions = <any>{ search: () => expect.fail() };
          query.registered = [];

          query.state.submit();
        });
      });

      describe('register()', () => {
        it('should add to registered', () => {
          const tag: any = { a: 'b' };

          query.state.register(tag);

          expect(query.registered).to.eql([tag]);
        });
      });
    });
  });
});
