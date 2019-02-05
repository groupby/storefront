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
      refinementCrumbs.subscribe = () => null;
    });

    it('should call updateState()', () => {
      const updateState = (refinementCrumbs.updateState = spy());
      refinementCrumbs.select = spy();
      refinementCrumbs.props.storeSection = StoreSections.DEFAULT;

      refinementCrumbs.init();

      expect(updateState).to.be.called;
    });

    describe('SEARCH storeSection', () => {
      beforeEach(() => {
        refinementCrumbs.props.storeSection = StoreSections.SEARCH;
        refinementCrumbs.updateState = () => null;
      });

      it('should set the navigationSelector and selectedRefinementsUpdated based on SEARCH storeSection', () => {
        const select = (refinementCrumbs.select = spy());
        refinementCrumbs.init();

        refinementCrumbs.state.navigationSelector(field);

        expect(refinementCrumbs.state.selectedRefinementsUpdated).to.eq(Events.SELECTED_REFINEMENTS_UPDATED);
        expect(select).to.be.calledWithExactly(Selectors.navigation, field);
      });

      it('should listen for NAVIGATIONS_UPDATED based on SEARCH storeSection', () => {
        const subscribe = refinementCrumbs.subscribe = spy();

        refinementCrumbs.init();

        expect(subscribe).to.be.calledWithExactly(Events.NAVIGATIONS_UPDATED, refinementCrumbs.updateRefinements);
      });

      // tslint:disable-next-line max-line-length
      it('should not listen for NAVIGATIONS_UPDATED based on SEARCH storeSection if the selectedRefinements prop is available', () => {
        const selectedNavigation: any = {};
        const subscribe = refinementCrumbs.subscribe = spy();
        refinementCrumbs.props = { field, selectedNavigation };

        refinementCrumbs.init();

        expect(subscribe).to.not.be.called;
      });
    });

    describe('PAST_PURCHASES storeSection', () => {
      beforeEach(() => {
        refinementCrumbs.props.storeSection = StoreSections.PAST_PURCHASES;
        refinementCrumbs.updateState = () => null;
      });

      it('should set the navigationSelector and selectedRefinementsUpdated base on PAST_PURCHASES storeSection', () => {
        const select = (refinementCrumbs.select = spy());
        refinementCrumbs.init();

        refinementCrumbs.state.navigationSelector(field);

        // tslint:disable-next-line max-line-length
        expect(refinementCrumbs.state.selectedRefinementsUpdated).to.eq(Events.PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED);
        expect(select).to.be.calledWithExactly(Selectors.pastPurchaseNavigation, field);
      });

      it('should listen for PAST_PURCHASE_NAVIGATIONS_UPDATED based on PAST_PURCHASES storeSection', () => {
        const subscribe = refinementCrumbs.subscribe = spy();

        refinementCrumbs.init();

        // tslint:disable-next-line max-line-length
        expect(subscribe).to.be.calledWithExactly(Events.PAST_PURCHASE_NAVIGATIONS_UPDATED, refinementCrumbs.updateRefinements);
      });
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

    it('should extract the field and navigation data from `props.selectedNavigation`', () => {
      const field = 'foo';
      const range = true;
      const refinements = [];
      const selected = [];
      const selectedNavigation = {
        field,
        range,
        refinements,
        selected,
      };
      refinementCrumbs.props = <any>{ selectedNavigation };

      const selectedRefinements = refinementCrumbs.selectRefinements(() => null);

      expect(selectedRefinements).to.eql(selectedNavigation);
    });

    it('should extract the field from props and compute the navigation data', () => {
      const field = 'foo';
      const range = true;
      const refinements = [];
      const selected = [];
      const navigation = {
        field,
        range,
        refinements,
        selected,
      };
      const navigationSelector = spy(() => null);
      refinementCrumbs.props = <any>{ field };

      refinementCrumbs.selectRefinements(navigationSelector);

      expect(navigationSelector).to.be.calledWithExactly(field);
    });

    it('should return build navigation state', () => {
      const range = true;
      const selected = [0, 2];
      const label = 'navlabel';
      const navigation = {
        a: 'b',
        label,
        range,
        selected,
        boolean: false,
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
        label,
        range,
        selected,
        boolean: false,
        refinements: [
          { field, range, boolean: false, navigationLabel: label, index: 0, selected: true, a: 'b' },
          { field, range, boolean: false, navigationLabel: label, index: 2, selected: true, e: 'f' },
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
