import ClearQuery from '../../src/clear-query';
import suite from './_suite';

suite('ClearQuery', ({ expect, spy, itShouldProvideAlias }) => {
  let clearQuery: ClearQuery;

  beforeEach(() => (clearQuery = new ClearQuery()));

  itShouldProvideAlias(ClearQuery, 'clearQuery');

  describe('constructor()', () => {
    describe('state', () => {
      describe('onClick()', () => {
        it('should call actions.resetQuery()', () => {
          const resetQuery = spy();
          clearQuery.actions = <any>{ resetQuery };

          clearQuery.state.onClick();

          expect(resetQuery).to.be.called;
        });
      });
    });
  });
});
