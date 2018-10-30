import NavigationHeader from '../../src/navigation-header';
import suite from './_suite';

suite('NavigationHeader', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let navigationHeader: NavigationHeader;

  beforeEach(() => (navigationHeader = new NavigationHeader()));

  itShouldProvideAlias(NavigationHeader, 'navigationHeader');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(navigationHeader.props).to.be.eql({ icons: {} });
      });
    });
  });
});
