import { Events, StoreSections } from '@storefront/core';
import * as Sinon from 'sinon';
import RefinementPillsCategory from '../../src/refinement-pills-category';
import suite from './_suite';

suite('RefinementPillsCategory', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let refinementPillsCategory: RefinementPillsCategory;

  beforeEach(() => {
    refinementPillsCategory = new RefinementPillsCategory();
    refinementPillsCategory.props.storeSection = StoreSections.PAST_PURCHASES;
  });

  itShouldProvideAlias(RefinementPillsCategory, 'refinementPillsCategory');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        const tag = new RefinementPillsCategory();

        expect(tag.props).to.eql({});
      });
    });

    describe('state', () => {
      it('should set initial value', () => {
        const tag = new RefinementPillsCategory();

        expect(tag.state).to.eql({
          refinements: [],
        });
      });
    });
  });

  describe('init()', () => {
    it('should call updateState()', () => {
      const updateState = (refinementPillsCategory.updateState = spy());

      refinementPillsCategory.init();

      expect(updateState).to.be.calledOnce;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState()', () => {
      const updateState = (refinementPillsCategory.updateState = spy());
      const state: any = { a: 1 };
      refinementPillsCategory.state = state;

      refinementPillsCategory.onUpdate();

      expect(updateState).to.be.calledOnce;
    });
  });

  describe('updateState()', () => {
    it('should set state', () => {
      const field = 'colors';
      const onClick = spy();
      const navigation: any = {
        field,
        selected: [1],
        refinements: [{ a: 1, onClick }, { b: 2 }, { c: 3 }],
      };
      const newNavigation: any = {
        field,
        selected: [1],
        refinements: [{ a: 1, selected: false, onClick }, { b: 2, selected: true }, { c: 3, selected: false }],
      };
      const newRefinements: any = [
        {
          a: 1,
          selected: false,
          onClick,
        },
        {
          b: 2,
          selected: true,
          onClick: () => this.actions['resetPastPurchaseQueryAndSelectRefinement'](field, 1),
        },
        {
          c: 3,
          selected: false,
          onClick: () => this.actions['resetPastPurchaseQueryAndSelectRefinement'](field, 2),
        },
      ];
      refinementPillsCategory.props.navigation = navigation;
      refinementPillsCategory.actions = <any>{};
      const action = (refinementPillsCategory.actions.resetPastPurchaseQueryAndSelectRefinement = spy());

      refinementPillsCategory.updateState();

      expect(refinementPillsCategory.state.navigation).to.be.eql(newNavigation);
      expect(JSON.stringify(refinementPillsCategory.state.refinements)).to.be.eql(JSON.stringify(newRefinements));
      refinementPillsCategory.state.refinements[0]['onClick']();
      expect(onClick).to.be.calledOnce;
      refinementPillsCategory.state.refinements[1]['onClick']();
      expect(action).to.be.calledWithExactly(field, 1);
      refinementPillsCategory.state.refinements[2]['onClick']();
      expect(action).to.be.calledWithExactly(field, 2);
    });
  });

  it('should set state when navigation is undefined', () => {
    refinementPillsCategory.props.navigation = undefined;
    const set = (refinementPillsCategory.set = spy());
    refinementPillsCategory.actions = <any>{};

    refinementPillsCategory.updateState();

    expect(refinementPillsCategory.state).to.be.eql({ navigation: undefined, refinements: [] });
  });
});
