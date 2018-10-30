import { StoreSections } from '@storefront/core';
import ClearRefinement from '../../src/clear-refinement';
import suite from './_suite';

suite('ClearRefinement', ({ expect, spy, itShouldProvideAlias }) => {
  let clearRefinement: ClearRefinement;

  beforeEach(() => (clearRefinement = new ClearRefinement()));

  itShouldProvideAlias(ClearRefinement, 'clearRefinement');

  describe('init()', () => {
    const field = 'brand';
    const index = 13;

    beforeEach(() => {
      clearRefinement.props = { field, index };
      clearRefinement.state = <any>{};
      clearRefinement.actions = <any>{
        deselectRefinement: spy(),
        deselectPastPurchaseRefinement: spy(),
      };
    });

    it('should set state.action to actions.deselectRefinement() if storeSection is search', () => {
      clearRefinement.props.storeSection = StoreSections.SEARCH;
      const deselectRefinement = (clearRefinement.actions.deselectRefinement = spy());

      clearRefinement.init();
      clearRefinement.state.onClick();

      expect(deselectRefinement).to.be.calledWithExactly(field, index);
    });

    it('should set state.action to actions.deselectPastPurchaseRefinement() if storeSection is pastpurchases', () => {
      clearRefinement.props.storeSection = StoreSections.PAST_PURCHASES;
      const deselectPastPurchaseRefinement = (clearRefinement.actions.deselectPastPurchaseRefinement = spy());

      clearRefinement.init();
      clearRefinement.state.onClick();

      expect(deselectPastPurchaseRefinement).to.be.calledWithExactly(field, index);
    });
  });

  describe('onClick()', () => {
    it('should call state.action()', () => {
      clearRefinement.state = { onClick: spy() };

      clearRefinement.state.onClick();

      expect(clearRefinement.state.onClick).to.be.called;
    });
  });
});
