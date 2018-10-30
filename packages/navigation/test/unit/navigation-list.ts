import NavigationList from '../../src/navigation-list';
import suite from './_suite';

suite('NavigationList', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let navigationList: NavigationList;

  beforeEach(() => (navigationList = new NavigationList()));

  itShouldProvideAlias(NavigationList, 'navigationList');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial values', () => {
        expect(navigationList.props).eql(<any>{ fields: [], itemProps: {} });
      });
    });
  });
});
