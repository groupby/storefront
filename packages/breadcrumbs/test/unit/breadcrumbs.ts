import { Events, Selectors, StoreSections } from '@storefront/core';
import * as sinon from 'sinon';
import Breadcrumbs from '../../src/breadcrumbs';
import suite from './_suite';

const QUERY = 'ballroom shoes';
const CORRECTED_QUERY = 'giraffe';

suite('Breadcrumbs', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let breadcrumbs: Breadcrumbs;
  let select: sinon.SinonStub;

  beforeEach(() => {
    select = Breadcrumbs.prototype.select = stub();
    select.withArgs(Selectors.query).returns(QUERY);
    select.withArgs(Selectors.currentQuery).returns(QUERY);
    Breadcrumbs.prototype.flux = <any>{};
    breadcrumbs = new Breadcrumbs();
  });
  afterEach(() => {
    delete Breadcrumbs.prototype.flux;
    delete Breadcrumbs.prototype.select;
  });

  itShouldBeConfigurable(Breadcrumbs);
  itShouldProvideAlias(Breadcrumbs, 'breadcrumbs');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(breadcrumbs.props).to.eql({
          showLabels: true,
          labels: {
            results: 'Results:',
            noResults: 'No Results:',
            corrected: 'Corrected:',
          },
        });
      });
    });
  });

  describe('init()', () => {
    const fields = ['c', 'd'];
    let getFields;

    beforeEach(() => {
      breadcrumbs.state = { fields, originalQuery: '' };
      getFields = stub(breadcrumbs, 'getFields').returns(fields);
    });

    it('should listen for ORIGINAL_QUERY_UPDATED, CORRECTED_QUERY_UPDATED and NAVIGATIONS_UPDATED if the storeSection is search', () => {
      const subscribe = (breadcrumbs.subscribe = spy());
      breadcrumbs.props.storeSection = StoreSections.SEARCH;
      breadcrumbs.updateOriginalQuery = () => null;

      breadcrumbs.init();

      expect(subscribe).to.be.calledWith(Events.ORIGINAL_QUERY_UPDATED, breadcrumbs.updateOriginalQuery);
      expect(subscribe).to.be.calledWith(Events.CORRECTED_QUERY_UPDATED, breadcrumbs.updateCorrectedQuery);
      expect(subscribe).to.be.calledWith(Events.NAVIGATIONS_UPDATED, breadcrumbs.updateFields);
    });

    it('should listen for PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED if the storeSection is pastPurchases', () => {
      const subscribe = (breadcrumbs.subscribe = spy());
      breadcrumbs.props.storeSection = StoreSections.PAST_PURCHASES;
      breadcrumbs.updateOriginalQuery = () => null;

      breadcrumbs.init();

      expect(subscribe).to.be.calledWith(Events.PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED, breadcrumbs.updateFields);
    });

    it('should set initial state', () => {
      breadcrumbs.props = { storeSection: StoreSections.DEFAULT };
      breadcrumbs.subscribe = () => null;

      breadcrumbs.init();
      const navigationsSelector = (breadcrumbs.state.navigationsSelector = spy());

      expect(breadcrumbs.state).to.eql({ fields, originalQuery: QUERY, navigationsSelector });
    });

    it('should set the navigationsSelector function to select navigation if the storeSection is search', () => {
      breadcrumbs.props.storeSection = StoreSections.SEARCH;
      breadcrumbs.subscribe = () => null;
      breadcrumbs.updateOriginalQuery = () => null;
      const select = (breadcrumbs.select = spy());

      breadcrumbs.init();
      breadcrumbs.state.navigationsSelector();

      expect(select).to.be.calledWithExactly(Selectors.navigations);
    });

    it('should set the navigationsSelector function to select pastPurchaseNavigation if the storeSection is pastPurchases', () => {
      breadcrumbs.props.storeSection = StoreSections.PAST_PURCHASES;
      breadcrumbs.subscribe = () => null;
      breadcrumbs.updateOriginalQuery = () => null;
      const select = (breadcrumbs.select = spy());

      breadcrumbs.init();
      breadcrumbs.state.navigationsSelector();

      expect(select).to.be.calledWithExactly(Selectors.pastPurchaseNavigations);
    });
  });

  describe('onBeforeMount()', () => {
    it('should call updateCorrectedQuery', () => {
      breadcrumbs.state = <any>{};
      breadcrumbs.updateOriginalQuery = spy();
      const updateCorrectedQuery = (breadcrumbs.updateCorrectedQuery = spy());
      select.withArgs(Selectors.currentQuery).returns(CORRECTED_QUERY);

      breadcrumbs.onBeforeMount();

      expect(updateCorrectedQuery).to.be.calledOnce;
    });
  });

  describe('updateOriginalQuery()', () => {
    it('should set originalQuery', () => {
      const originalQuery = 'panco';
      const set = (breadcrumbs.set = spy());

      breadcrumbs.updateOriginalQuery(originalQuery);

      expect(set).to.be.calledWith({ originalQuery });
    });
  });

  describe('updateCorrectedQuery()', () => {
    it('should set correctedQuery', () => {
      const correctedQuery = 'panko';
      const set = (breadcrumbs.set = spy());

      breadcrumbs.updateCorrectedQuery(correctedQuery);

      expect(set).to.be.calledWith({ correctedQuery });
    });
  });

  describe('updateFields()', () => {
    it('should set fields', () => {
      const fields = ['a', 'b'];
      const set = (breadcrumbs.set = spy());
      breadcrumbs.state = { fields: [], originalQuery: '', navigationsSelector: () => null };
      stub(breadcrumbs, 'getFields').returns(fields);

      breadcrumbs.updateFields();

      expect(set).to.be.calledWith({ fields });
    });
  });

  describe('getFields()', () => {
    it('should get fields', () => {
      breadcrumbs.state = { fields: [], originalQuery: '' };
      const navigations = <any>[{ selected: [1], field: 'c' }, { selected: [2, 3], field: 'd' }, { selected: [] }];
      const select = (breadcrumbs.state.navigationsSelector = spy(() => navigations));

      const navFields = breadcrumbs.getFields(select());

      expect(select).to.be.called;
      expect(navFields).to.be.eql(['c', 'd']);
    });
  });
});
