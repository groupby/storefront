import { Events, Selectors, StoreSections } from '@storefront/core';
import Navigation from '../../src/navigation';
import suite from './_suite';

suite('Navigation', ({ expect, spy, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let navigation: Navigation;

  beforeEach(() => (navigation = new Navigation()));

  itShouldBeConfigurable(Navigation);
  itShouldProvideAlias(Navigation, 'navigation');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial values', () => {
        expect(navigation.props).to.eql({
          alwaysShowTotals: false,
          display: {},
          labels: {},
          collapse: true,
          showOnlyAvailableNavHeaders: false,
        });
      });
    });

    describe('state', () => {
      it('should set initial value', () => {
        expect(navigation.state).to.eql({ fields: [] });
      });
    });
  });

  describe('init()', () => {
    const fields = [1, 2, 3];
    let subscribe;
    let select;
    let updateFields;

    beforeEach(() => {
      subscribe = (navigation.subscribe = spy());
      select = (navigation.select = spy(() => fields));
      updateFields = (navigation.updateFields = spy());
    });

    it('should listen for NAVIGATIONS_UPDATED when storeSection is search and set up initial state', () => {
      navigation.props.storeSection = StoreSections.SEARCH;
      navigation.init();

      expect(subscribe).to.be.calledWith(Events.NAVIGATIONS_UPDATED, navigation.updateFields);
      expect(select).to.be.calledWithExactly(Selectors.navigationsObject);
      expect(updateFields).to.be.calledWithExactly(fields);
      expect(updateFields).to.be.calledOnce;
    });

    it('should listen for PAST_PURCHASE_NAVIGATIONS_UPDATED when storeSection is pastPurchases and set up initial state', () => {
      navigation.props.storeSection = StoreSections.PAST_PURCHASES;
      navigation.init();

      expect(subscribe).to.be.calledWith(Events.PAST_PURCHASE_NAVIGATIONS_UPDATED, navigation.updateFields);
      expect(select).to.be.calledWithExactly(Selectors.pastPurchaseNavigationsObject);
      expect(updateFields).to.be.calledWithExactly(fields);
      expect(updateFields).to.be.calledOnce;
    });

    it('should set the navigationSelector function to select navigation if the storeSection is search', () => {
      navigation.props.storeSection = StoreSections.SEARCH;

      navigation.init();
      navigation.state.availableNavigationSelector();

      expect(select).to.be.calledWithExactly(Selectors.availableNavigations);
    });

    it('should set the navigationSelector function to select pastPurchaseNavigationsObject if the storeSection is pastPurchases', () => {
      navigation.props.storeSection = StoreSections.PAST_PURCHASES;

      navigation.init();
      navigation.state.availableNavigationSelector();

      expect(select).to.be.calledWithExactly(Selectors.availablePastPurchaseNavigations);
    });
  });

  describe('updateFields()', () => {
    const fields = ['a', 'b', 'c'];
    const display = { a: 'value', b: 'range' };
    const labels = { b: 'B', c: 'C' };
    const navigationsObject: any = { allIds: fields };
    let set;
    let select;

    beforeEach(() => {
      set = navigation.set = spy();
      select = navigation.select = spy(() => navigationsObject);
    });

    it('should set fields, with active set for the first x number of fields based on isActive', () => {
      navigation.props = <any>{ display, labels, collapse: { isActive: 2 }, alwaysShowTotals: false };

      navigation.updateFields(navigationsObject);

      expect(set).to.be.calledWith({
        fields: [
          { value: 'a', display: 'value', label: undefined, active: true, alwaysShowTotals: false },
          { value: 'b', display: 'range', label: 'B', active: true, alwaysShowTotals: false },
          { value: 'c', display: undefined, label: 'C', active: false, alwaysShowTotals: false },
        ],
      });
    });

    it('should set fields with active true when isActive true', () => {
      navigation.props = <any>{ display, labels, collapse: { isActive: true }, alwaysShowTotals: false };

      navigation.updateFields(navigationsObject);

      expect(set).to.be.calledWith({
        fields: [
          { value: 'a', display: 'value', label: undefined, active: true, alwaysShowTotals: false },
          { value: 'b', display: 'range', label: 'B', active: true, alwaysShowTotals: false },
          { value: 'c', display: undefined, label: 'C', active: true, alwaysShowTotals: false },
        ],
      });
    });

    it('should set fields with active false when isActive false', () => {
      navigation.props = <any>{ display, labels, collapse: { isActive: false }, alwaysShowTotals: false };

      navigation.updateFields(navigationsObject);

      expect(set).to.be.calledWith({
        fields: [
          { value: 'a', display: 'value', label: undefined, active: false, alwaysShowTotals: false },
          { value: 'b', display: 'range', label: 'B', active: false, alwaysShowTotals: false },
          { value: 'c', display: undefined, label: 'C', active: false, alwaysShowTotals: false },
        ],
      });
    });

    it('should set fields with active true when collapse true', () => {
      navigation.props = <any>{ display, labels, collapse: true, alwaysShowTotals: false };

      navigation.updateFields(navigationsObject);

      expect(set).to.be.calledWith({
        fields: [
          { value: 'a', display: 'value', label: undefined, active: true, alwaysShowTotals: false },
          { value: 'b', display: 'range', label: 'B', active: true, alwaysShowTotals: false },
          { value: 'c', display: undefined, label: 'C', active: true, alwaysShowTotals: false },
        ],
      });
    });

    it('should set fields with active true when collapse false', () => {
      navigation.props = <any>{ display, labels, collapse: false, alwaysShowTotals: false };

      navigation.updateFields(navigationsObject);

      expect(set).to.be.calledWith({
        fields: [
          { value: 'a', display: 'value', label: undefined, active: true, alwaysShowTotals: false },
          { value: 'b', display: 'range', label: 'B', active: true, alwaysShowTotals: false },
          { value: 'c', display: undefined, label: 'C', active: true, alwaysShowTotals: false },
        ],
      });
    });

    it('should use only available navigations if showOnlyAvailableNavHeaders', () => {
      const navigationSelect = (navigation.state.availableNavigationSelector = spy(() => [{ field: 'd' }, { field: 'e' }]));
      navigation.props = <any>{
        display: { d: 'value', e: 'range' },
        labels: { d: undefined, e: 'B' },
        collapse: false,
        showOnlyAvailableNavHeaders: true,
        alwaysShowTotals: false,
      };

      navigation.updateFields(navigationsObject);

      expect(navigation.state.availableNavigationSelector).to.be.called;
      expect(set).to.be.calledWith({
        fields: [
          { value: 'd', display: 'value', label: undefined, active: true, alwaysShowTotals: false },
          { value: 'e', display: 'range', label: 'B', active: true, alwaysShowTotals: false },
        ],
      });
    });

    it('should add', () => {
      const alwaysShowTotals = true;
      navigation.props = <any>{ display, labels, collapse: { isActive: 2 }, alwaysShowTotals };

      navigation.updateFields(navigationsObject);

      expect(set).to.be.calledWith({
        fields: [
          { value: 'a', display: 'value', label: undefined, active: true, alwaysShowTotals },
          { value: 'b', display: 'range', label: 'B', active: true, alwaysShowTotals },
          { value: 'c', display: undefined, label: 'C', active: false, alwaysShowTotals },
        ],
      });
    });
  });
});
