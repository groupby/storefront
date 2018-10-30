import Navigations from '../../src/navigations';
import suite from './_suite';

suite('Navigations', ({ expect, spy, itShouldProvideAlias }) => {
  let navigations: Navigations;

  beforeEach(() => (navigations = new Navigations()));

  itShouldProvideAlias(Navigations, 'navigations');

  describe('constructor()', () => {
    describe('state', () => {
      describe('onClick()', () => {
        it('should dispatch actions.updateSearch()', () => {
          const navigationId = 'author';
          const value = 'margaret atwood';
          const action = { a: 'b' };
          const updateSearch = spy(() => action);
          const handler = navigations.state.onClick(navigationId, value);
          navigations.actions = <any>{ updateSearch };

          handler();

          expect(updateSearch).to.be.calledWith({ navigationId, value, query: null, clear: true });
        });
      });
    });
  });
});
