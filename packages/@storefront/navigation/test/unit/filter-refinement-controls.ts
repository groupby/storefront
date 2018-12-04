import { StoreSections } from '@storefront/core';
import FilterRefinementControls from '../../src/filter-refinement-controls';
import ValueRefinementControls from '../../src/value-refinement-controls';
import suite from './_suite';

suite('FilterRefinementControls', ({ expect, spy, stub }) => {
  let filterRefinementControls: FilterRefinementControls;

  beforeEach(() => (filterRefinementControls = new FilterRefinementControls()));

  describe('constructor()', () => {
    it('should extend ValueRefinementControls', () => {
      expect(filterRefinementControls).to.be.an.instanceof(ValueRefinementControls);
    });
  });

  describe('get alias()', () => {
    it('should return the alias string', () => {
      expect(filterRefinementControls.alias).to.eq('filterControls');
    });
  });

  describe('get selectMultipleRefinements', () => {
    it('should return `selectMultipleRefinements` if storeSection is search', () => {
      filterRefinementControls.props = <any>{ storeSection: StoreSections.SEARCH };

      expect(filterRefinementControls.selectMultipleRefinements).to.eq('selectMultipleRefinements');
    });

    it('should return `selectMultiplePastPurchaseRefinements` if storeSection is past purchases', () => {
      filterRefinementControls.props = <any>{ storeSection: StoreSections.PAST_PURCHASES };

      expect(filterRefinementControls.selectMultipleRefinements).to.eq('selectMultiplePastPurchaseRefinements');
    });
  })

  describe('fetchMoreRefinements()', () => {
    it('should fetch more refinements if there are more to fetch', () => {
      const moreRefinements = spy();
      filterRefinementControls.state = { more: true, moreRefinements };

      filterRefinementControls.fetchMoreRefinements();

      expect(moreRefinements).to.be.called;
    });
  });

  describe('selectMatchedRefinements()', () => {
    it('should dispatch a SelectMultipleRefinements action', () => {
      const refinements: any = [{ index: 1 }, { index: 2 }, { index: 3 }];
      const selectMultipleRefinements = spy();
      const navigationId = '12345';
      stub(filterRefinementControls, 'selectMultipleRefinements').value('selectMultipleRefinements');
      filterRefinementControls.props = { navigation: { field: navigationId } };
      filterRefinementControls.actions = <any>{ selectMultipleRefinements };

      filterRefinementControls.selectMatchedRefinements(<any>{}, refinements);

      expect(selectMultipleRefinements).to.be.calledWith(navigationId, [1,2,3]);
    });
  });
});
