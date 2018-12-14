import { Selectors, StoreSections } from '@storefront/core';
import RefinementControls from '../../src/refinement-controls';
import ValueRefinementControls from '../../src/value-refinement-controls';
import suite from './_suite';

suite('ValueRefinementControls', ({ expect, spy, stub }) => {
  const field = 'myfield';
  let valueRefinementControls: ValueRefinementControls;

  beforeEach(() => (valueRefinementControls = new ValueRefinementControls()));

  describe('constructor()', () => {
    it('should extend RefinementControls', () => {
      expect(valueRefinementControls).to.be.an.instanceof(RefinementControls);
    });

    describe('state', () => {
      describe('moreRefinements()', () => {
        let fetchMorePastPurchaseRefinements;
        let fetchMoreRefinements;

        beforeEach(() => {
          fetchMorePastPurchaseRefinements = spy();
          fetchMoreRefinements = spy();
          valueRefinementControls.actions = <any>{
            fetchMorePastPurchaseRefinements,
            fetchMoreRefinements,
          };
        });

        it('should call actions.fetchMoreRefinements()', () => {
          valueRefinementControls.props = {
            navigation: { field },
            storeSection: StoreSections.SEARCH,
          };
          valueRefinementControls.actionNames = { fetchMore: 'fetchMoreRefinements' };

          valueRefinementControls.state.moreRefinements();

          expect(fetchMoreRefinements).to.be.calledWith(field);
        });

        it('should call actions.fetchMorePastPurchasesRefinements()', () => {
          valueRefinementControls.props = {
            navigation: { field },
            storeSection: StoreSections.PAST_PURCHASES,
          };
          valueRefinementControls.actionNames = { fetchMore: 'fetchMorePastPurchaseRefinements' };

          valueRefinementControls.state.moreRefinements();

          expect(fetchMorePastPurchaseRefinements).to.be.calledWith(field);
        });
      });
    });
  });

  describe('init', () => {
    beforeEach(() => {
      valueRefinementControls.provide = () => null;
      valueRefinementControls.updateState = () => null;
    });

    it('it should correctly set the action names for search', () => {
      valueRefinementControls.props = <any>{ storeSection: StoreSections.SEARCH };
      valueRefinementControls.init();
      expect(valueRefinementControls.actionNames).to.eql({
        deselect: 'deselectRefinement',
        fetchMore: 'fetchMoreRefinements',
        select: 'selectRefinement',
      });
    });

    it('it should correctly set the action names for past purchases', () => {
      valueRefinementControls.props = <any>{ storeSection: StoreSections.PAST_PURCHASES };
      valueRefinementControls.init();
      expect(valueRefinementControls.actionNames).to.eql({
        deselect: 'deselectPastPurchaseRefinement',
        fetchMore: 'fetchMorePastPurchaseRefinements',
        select: 'selectPastPurchaseRefinement',
      });
    });
  });

  describe('alias', () => {
    it('should return alias name', () => {
      expect(valueRefinementControls.alias).to.eq('valueControls');
    });
  });

  describe('transformNavigation()', () => {
    beforeEach(() => {
      valueRefinementControls.actionNames = {
        deselect: 'deselectRefinement',
        select: 'selectRefinement',
      };
    });

    it('should add onClick() handlers', () => {
      const navigation: any = { a: 'b', refinements: [{ c: 'd' }, { e: 'f' }] };

      const transformed = valueRefinementControls.transformNavigation<any>(navigation);

      expect(transformed.refinements).to.have.length(2);
      transformed.refinements.forEach((refinement) => {
        expect(refinement.onClick).to.be.a('function');
      });
    });

    it('should call actions.selectRefinement() when onClick() called', () => {
      const index = 8;
      const navigation: any = { refinements: [{ index }] };
      const selectRefinement = spy();
      valueRefinementControls.actions = <any>{ selectRefinement };
      valueRefinementControls.props = { navigation: { field } };

      const transformed = valueRefinementControls.transformNavigation<any>(navigation);
      transformed.refinements[0].onClick();

      expect(selectRefinement).to.be.calledWithExactly(field, index);
    });

    it('should call actions.deselectRefinement() when onClick() called', () => {
      const index = 8;
      const navigation: any = { refinements: [{ index, selected: true }] };
      const deselectRefinement = spy();
      valueRefinementControls.actions = <any>{ deselectRefinement };
      valueRefinementControls.props = { navigation: { field } };

      const transformed = valueRefinementControls.transformNavigation<any>(navigation);
      transformed.refinements[0].onClick();

      expect(deselectRefinement).to.be.calledWithExactly(field, index);
    });
  });
});
