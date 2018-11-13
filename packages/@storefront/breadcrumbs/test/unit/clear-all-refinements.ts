import { StoreSections } from '@storefront/core';
import ClearAllRefinements from '../../src/clear-all-refinements';
import suite from './_suite';

suite('ClearAllRefinements', ({ expect, spy, stub }) => {
  let clearAllRefinements: ClearAllRefinements;

  beforeEach(() => (clearAllRefinements = new ClearAllRefinements()));

  describe('init()', () => {
    beforeEach(() => {
      clearAllRefinements.state = <any>{};
      clearAllRefinements.actions = <any>{
        resetRefinements: spy(),
        resetPastPurchaseRefinements: spy(),
      };
    });

    it('should set state.action to actions.resetRefinements() if storeSection is search', () => {
      clearAllRefinements.props = { storeSection: StoreSections.SEARCH };
      const resetRefinements = (clearAllRefinements.actions.resetRefinements = spy());

      clearAllRefinements.init();
      clearAllRefinements.state.onClick();

      expect(resetRefinements).to.be.calledWithExactly(true);
    });

    it('should set state.action to actions.resetPastPurchaseRefinements() if storeSection is pastpurchases', () => {
      clearAllRefinements.props = { storeSection: StoreSections.PAST_PURCHASES };
      const resetPastPurchaseRefinements = (clearAllRefinements.actions.resetPastPurchaseRefinements = spy());

      clearAllRefinements.init();
      clearAllRefinements.state.onClick();

      expect(resetPastPurchaseRefinements).to.be.calledWithExactly(true);
    });
  });

  describe('onClick()', () => {
    it('should call state.onClick()', () => {
      clearAllRefinements.state = { onClick: spy() };

      clearAllRefinements.onClick();

      expect(clearAllRefinements.state.onClick).to.be.called;
    });
  });
});
