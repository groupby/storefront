import { Events, Selectors } from '@storefront/core';
import RefinementControls from '../../src/refinement-controls';
import suite from './_suite';

const ALIAS = 'mockControls';
class MockRefinementControls extends RefinementControls {
  get alias() {
    return ALIAS;
  }
}

suite('RefinementControls', ({ expect, spy, stub }) => {
  let refinementControls: RefinementControls;

  beforeEach(() => (refinementControls = new MockRefinementControls()));

  describe('init()', () => {
    it('should expose alias and call updateState()', () => {
      const provide = (refinementControls.provide = spy());
      const updateState = (refinementControls.updateState = spy());

      refinementControls.init();

      expect(provide).to.be.calledWithExactly(ALIAS);
      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState()', () => {
      const updateState = (refinementControls.updateState = spy());

      refinementControls.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    it('should set navigation', () => {
      const navigation = { c: 'd' };
      const transformNavigation = (refinementControls.transformNavigation = spy(() => ({ e: 'f' })));
      refinementControls.state = <any>{ a: 'b' };
      refinementControls.props = <any>{ navigation };

      refinementControls.updateState();

      expect(transformNavigation).to.be.calledWith(navigation);
      expect(refinementControls.state).to.eql({ a: 'b', e: 'f' });
    });
  });

  describe('transformNavigation()', () => {
    it('should be an identity function', () => {
      const navigation: any = { a: 'b' };

      expect(refinementControls.transformNavigation(navigation)).to.eq(navigation);
    });
  });
});
