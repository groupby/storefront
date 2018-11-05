import { Events, Selectors, StoreSections } from '@storefront/core';
import RefinementCrumbs from '../../src/refinement-crumbs';
import suite from './_suite';

suite('RefinementCrumbs', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let refinementCrumbs: RefinementCrumbs;

  beforeEach(() => (refinementCrumbs = new RefinementCrumbs()));

  itShouldProvideAlias(RefinementCrumbs, 'refinementCrumbs');

  describe('init()', () => {
    const field = 'material';

    beforeEach(() => {
      refinementCrumbs.props = { field };
      refinementCrumbs.state = <any>{};
    });

    it('should call updateState()', () => {
      const updateState = (refinementCrumbs.updateState = spy());
      refinementCrumbs.select = spy();
      refinementCrumbs.props.storeSection = StoreSections.DEFAULT;

      refinementCrumbs.init();

      expect(updateState).to.be.called;
    });

    it('should set the navigationSelector and selectedRefinementsUpdated based on SEARCH storeSection', () => {
      const select = (refinementCrumbs.select = spy());
      refinementCrumbs.props.storeSection = StoreSections.SEARCH;
      refinementCrumbs.updateState = () => null;
      refinementCrumbs.init();

      refinementCrumbs.state.navigationSelector(field);

      expect(refinementCrumbs.state.selectedRefinementsUpdated).to.eq(Events.SELECTED_REFINEMENTS_UPDATED);
      expect(select).to.be.calledWithExactly(Selectors.navigation, field);
    });

    it('should set the navigationSelector and selectedRefinementsUpdated base on PAST_PURCHASES storeSection', () => {
      const select = (refinementCrumbs.select = spy());
      refinementCrumbs.props.storeSection = StoreSections.PAST_PURCHASES;
      refinementCrumbs.updateState = () => null;
      refinementCrumbs.init();

      refinementCrumbs.state.navigationSelector(field);

      expect(refinementCrumbs.state.selectedRefinementsUpdated).to.eq(Events.PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED);
      expect(select).to.be.calledWithExactly(Selectors.pastPurchaseNavigation, field);
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState()', () => {
      const updateState = (refinementCrumbs.updateState = spy());

      refinementCrumbs.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    const field = 'material';
    const selectedRefinementsUpdated = 'selected_refinements_updated';

    beforeEach(() => {
      refinementCrumbs.props = { field };
      refinementCrumbs.state = <any>{ selectedRefinementsUpdated };
    });

    it('should update field', () => {
      refinementCrumbs.previousField = 'brand';
      refinementCrumbs.flux = <any>{ off: () => null, on: () => null };
      refinementCrumbs.selectRefinements = () => null;

      refinementCrumbs.updateState();

      expect(refinementCrumbs.previousField).to.eq(field);
    });

    it('should remove selectedRefinementsUpdated listener', () => {
      const off = spy();
      const previousField = (refinementCrumbs.previousField = refinementCrumbs.previousField = 'brand');
      refinementCrumbs.props.storeSection = StoreSections.SEARCH;
      refinementCrumbs.flux = <any>{ off, on: () => null };
      refinementCrumbs.selectRefinements = () => null;

      refinementCrumbs.updateState();

      expect(off).to.be.calledWith(`${refinementCrumbs.state.selectedRefinementsUpdated}:${previousField}`);
    });

    it('should listen for selectedRefinementsUpdated', () => {
      const on = spy();
      refinementCrumbs.props.storeSection = StoreSections.SEARCH;
      refinementCrumbs.previousField = 'brand';
      refinementCrumbs.flux = <any>{ on, off: () => null };
      refinementCrumbs.selectRefinements = () => null;

      refinementCrumbs.updateState();

      expect(on).to.be.calledWith(`${refinementCrumbs.state.selectedRefinementsUpdated}:${field}`);
    });

    it('should call selectRefinements to update state', () => {
      const navigationSelector = () => null;
      const selectRefinements = refinementCrumbs.selectRefinements = spy();
      refinementCrumbs.state = { ...refinementCrumbs.state, navigationSelector };
      refinementCrumbs.flux = <any>{ on: () => null, off: () => null };

      refinementCrumbs.updateState();

      expect(selectRefinements).to.be.calledWith(navigationSelector);
    });

    it('should not update listeners or property if field has not changed, but it should always update', () => {
      const on = spy();
      const off = spy();
      const navigationSelector = () => null;
      const selectRefinements = refinementCrumbs.selectRefinements = spy();
      refinementCrumbs.state = { ...refinementCrumbs.state, navigationSelector };
      refinementCrumbs.previousField = field;
      refinementCrumbs.flux = <any>{ on, off };

      refinementCrumbs.updateState();

      expect(on).to.not.be.called;
      expect(off).to.not.be.called;
      expect(selectRefinements).to.be.calledWith(navigationSelector);
    });
  });

  describe('updateRefinements()', () => {
    it('should update state', () => {
      const newState: any = { a: 'b' };
      const set = (refinementCrumbs.set = spy());
      refinementCrumbs.state = <any>{ navigationSelector: () => null };
      refinementCrumbs.selectRefinements = () => newState;

      refinementCrumbs.updateRefinements();

      expect(set).to.be.calledWith(newState);
    });
  });

  describe('selectRefinements()', () => {
    const state = { a: 'b' };

    beforeEach(() => {
      refinementCrumbs.state = <any>{ navigationSelector: () => {} };
    });

    it('should return build navigation state', () => {
      const range = true;
      const selected = [0, 2];
      const navigation = {
        a: 'b',
        range,
        selected,
        refinements: [{ a: 'b' }, { c: 'd' }, { e: 'f' }],
      };
      const field = 'colour';
      refinementCrumbs.props = { field };
      refinementCrumbs.flux = { store: { getState: () => state } } as any;
      const navigationSelector = (refinementCrumbs.state.navigationSelector = spy((field) => navigation));
      const refinements = refinementCrumbs.selectRefinements(navigationSelector);

      expect(refinements).to.eql({
        a: 'b',
        field,
        range,
        selected,
        refinements: [
          { field, range, index: 0, selected: true, a: 'b' },
          { field, range, index: 2, selected: true, e: 'f' },
        ],
      });
      expect(navigationSelector).to.be.calledWith(field);
    });

    it('should return undefined if navigation is undefined', () => {
      const field = 'hat';
      refinementCrumbs.props = { field };
      refinementCrumbs.flux = { store: { getState: () => state } } as any;
      const navigationSelector = (refinementCrumbs.state.navigationSelector = spy((field) => {}));
      const refinements = refinementCrumbs.selectRefinements(navigationSelector);

      expect(refinements).to.be.undefined;
      expect(navigationSelector).to.be.calledWith(field);
    });
  });
});
