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

  describe('init()', () => {
    it('should call setIcon', () => {
      const setIcon = navigationHeader.setIcon = spy();

      navigationHeader.init();

      expect(setIcon).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call setIcon', () => {
      const setIcon = navigationHeader.setIcon = spy();

      navigationHeader.onUpdate();

      expect(setIcon).to.be.called;
    });
  });

  describe('setIcon()', () => {
    it('should set icon in state', () => {
      const icon = 'icon';
      const toggleIcon = navigationHeader.toggleIcon = spy(() => icon);

      navigationHeader.setIcon();

      expect(toggleIcon).to.be.called;
      expect(navigationHeader.state.icon).to.eq(icon);
    });
  });

  describe('toggleIcon()', () => {
    const toggleOpen = 'open';
    const toggleClosed = 'closed';
    const icons = { toggleOpen, toggleClosed };

    it('should return the toggleOpen icon when isActive is true', () => {
      navigationHeader.props = <any>{ isActive: true, icons };

      expect(navigationHeader.toggleIcon()).to.eq(toggleOpen);
    });

    it('should return the toggleClosed icon when isActive is false', () => {
      navigationHeader.props = <any>{ isActive: false, icons };

      expect(navigationHeader.toggleIcon()).to.eq(toggleClosed);
    });
  });
});
