import { Events, Selectors } from '@storefront/core';
import * as sinon from 'sinon';
import Autocomplete from '../../src/autocomplete';
import suite from './_suite';

const CATEGORY = 'brand';
const CATEGORY_VALUES = ['a', 'b', 'c'];
const SUGGESTIONS = ['d', 'e', 'f'];
const NAVIGATIONS = ['g', 'h', 'i'];
const PRODUCTS = ['j', 'k', 'l', 'm'];

suite('Autocomplete', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let autocomplete: Autocomplete;
  let select: sinon.SinonStub;
  let services: sinon.SinonStub;

  beforeEach(() => {
    Autocomplete.prototype.flux = <any>{};
    select = Autocomplete.prototype.select = stub();
    select.withArgs(Selectors.autocompleteSuggestions).returns(SUGGESTIONS);
    select.withArgs(Selectors.autocompleteCategoryField).returns(CATEGORY);
    select.withArgs(Selectors.autocompleteCategoryValues).returns(CATEGORY_VALUES);
    select.withArgs(Selectors.autocompleteNavigations).returns(NAVIGATIONS);
    select.withArgs(Selectors.autocompleteProducts).returns(PRODUCTS);
    autocomplete = new Autocomplete();
  });
  afterEach(() => {
    delete Autocomplete.prototype.flux;
    delete Autocomplete.prototype.select;
  });

  itShouldProvideAlias(Autocomplete, 'autocomplete');

  describe('constructor()', () => {
    describe('state', () => {
      it('should set initial value', () => {
        expect(autocomplete.state).to.eql({
          onHover: autocomplete.state.onHover,
          selected: -1,
          category: CATEGORY,
          categoryValues: CATEGORY_VALUES,
          suggestions: SUGGESTIONS,
          navigations: NAVIGATIONS,
          products: PRODUCTS,
        });
      });

      describe('onHover()', () => {
        const targets = [0, 'tar', 2, 3, 4];
        beforeEach(() => {
          autocomplete.activationTargets = spy(() => targets);
          autocomplete.setActivation = spy(() => null);
          autocomplete.config = <any>{ autocomplete: { hoverAutoFill: false } };
        });

        it('should do nothing if selected value did not change', () => {
          autocomplete.state.selected = 1;

          autocomplete.state.onHover(<any>{ target: 'tar' });

          expect(autocomplete.setActivation).to.not.be.called;
        });

        it('should not call setActivation with false activate if this.isActive() is false', () => {
          const target = 'tar';
          autocomplete.state.selected = 0;
          autocomplete.isActive = spy(() => false);

          autocomplete.state.onHover(<any>{ target });

          expect(autocomplete.setActivation).to.be.calledOnce.and.calledWith(
            targets,
            Array.from(targets).findIndex((element) => element === target),
            true
          );
        });

        it('should call setActivation with false activate if this.isActive() is true', () => {
          const target = 'tar';
          autocomplete.state.selected = 0;
          autocomplete.isActive = spy(() => true);

          autocomplete.state.onHover(<any>{ target });

          expect(autocomplete.setActivation)
            .to.be.calledTwice.and.calledWith(targets, autocomplete.state.selected, false)
            .and.calledWith(targets, Array.from(targets).findIndex((element) => element === target), true);
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for flux events', () => {
      const on = spy();
      autocomplete.flux = <any>{ on };
      const subscribe = (autocomplete.subscribe = spy());
      autocomplete.services = <any>{ autocomplete: { registerAutocomplete: () => null } };

      autocomplete.init();

      expect(on).to.be.calledWith(Events.AUTOCOMPLETE_SUGGESTIONS_UPDATED, autocomplete.updateSuggestions);
      expect(subscribe)
        .to.have.callCount(3)
        .and.calledWith('sayt:activate_next', autocomplete.activateNext)
        .and.calledWith('sayt:activate_previous', autocomplete.activatePrevious)
        .and.calledWith('sayt:select_active', autocomplete.selectActive);
    });

    it('should register with autocomplete service', () => {
      const registerAutocomplete = spy();
      autocomplete.services = <any>{ autocomplete: { registerAutocomplete } };
      autocomplete.flux = <any>{ on: () => null };
      autocomplete.subscribe = () => null;

      autocomplete.init();

      expect(registerAutocomplete).to.be.calledWith(autocomplete);
    });
  });

  describe('activationTargets()', () => {
    it('should return a NodeList of .gb-autocomplete-target elements', () => {
      const targets = ['a', 'b'];
      const querySelectorAll = spy(() => targets);
      autocomplete.root = <any>{ querySelectorAll };

      const selected = autocomplete.activationTargets();

      expect(selected).to.eq(targets);
      expect(querySelectorAll).to.be.calledWith('.gb-autocomplete-target');
    });
  });

  describe('activateNext()', () => {
    const targets = ['a', 'b', 'c'];

    it('should deactivate old target if it exists', () => {
      const selected = 1;
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.state = <any>{ selected };
      autocomplete.activationTargets = (): any => targets;
      autocomplete.isActive = () => true;

      autocomplete.activateNext();

      expect(setActivation)
        .to.be.calledTwice.and.calledWith(targets, selected, false)
        .and.calledWith(targets, selected + 1, true);
    });

    it('should only activate next if no old target exists', () => {
      const selected = 1;
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.state = <any>{ selected };
      autocomplete.activationTargets = (): any => targets;
      autocomplete.isActive = () => false;

      autocomplete.activateNext();

      expect(setActivation).to.be.calledOnce.and.calledWith(targets, selected + 1, true);
    });

    it('should not move activation if at end of targets', () => {
      autocomplete.setActivation = () => expect.fail();
      autocomplete.state = <any>{ selected: 2 };
      autocomplete.activationTargets = (): any => targets;

      autocomplete.activateNext();
    });
  });

  describe('activatePrevious()', () => {
    const targets = ['a', 'b', 'c'];

    it('should deactivate old target if it exists', () => {
      const selected = 1;
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.state = <any>{ selected };
      autocomplete.activationTargets = (): any => targets;
      autocomplete.isActive = () => true;

      autocomplete.activatePrevious();

      expect(setActivation)
        .to.be.calledTwice.and.calledWith(targets, selected, false)
        .and.calledWith(targets, selected - 1, true);
    });

    it('should not change activate element if no current active element', () => {
      autocomplete.setActivation = () => expect.fail();
      autocomplete.activationTargets = (): any => targets;
      autocomplete.isActive = () => false;

      autocomplete.activatePrevious();
    });
  });

  describe('selectActive()', () => {
    it('should click anchor tag in selected element', () => {
      const click = spy();
      const querySelector = spy(() => ({ click }));
      const set = (autocomplete.set = spy());
      autocomplete.state = <any>{ selected: 1 };
      autocomplete.activationTargets = (): any => [{}, { querySelector }, {}];
      autocomplete.isActive = () => true;

      autocomplete.selectActive();

      expect(querySelector).to.be.calledWith('a');
      expect(click).to.be.called;
      expect(set).to.be.calledWith({ selected: -1 });
    });

    it('should not remove selection if no active element', () => {
      autocomplete.set = () => expect.fail();
      autocomplete.isActive = () => false;

      autocomplete.selectActive();
    });
  });

  describe('updateSuggestions()', () => {
    const suggestions = ['1', '2', '3'];
    const navigations = ['4', '5', '6'];
    const categoryValues = ['7', '8', '9'];
    const products = ['10', '11'];

    it('should set values and not change activation', () => {
      const set = (autocomplete.set = spy());
      autocomplete.flux = <any>{ emit: () => null };
      autocomplete.isActive = () => false;
      autocomplete.setActivation = () => expect.fail();

      autocomplete.updateSuggestions(<any>{ suggestions, navigations, category: { values: categoryValues }, products });

      expect(set).to.be.calledWith({ suggestions, navigations, categoryValues, products, selected: -1 });
    });

    it('should not change activation if not mounted', () => {
      const set = (autocomplete.set = spy());
      autocomplete.flux = <any>{ emit: () => null };
      autocomplete.isActive = () => true;
      autocomplete.isMounted = false;
      autocomplete.setActivation = () => expect.fail();

      autocomplete.updateSuggestions(<any>{ suggestions, navigations, category: { values: categoryValues }, products });
    });

    it('should deactivate selected element', () => {
      const selected = 1;
      const targets = ['a', 'b', 'c'];
      const set = (autocomplete.set = spy());
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.flux = <any>{ emit: () => null };
      autocomplete.activationTargets = (): any => targets;
      autocomplete.state = <any>{ selected };
      autocomplete.isActive = () => true;
      autocomplete.isMounted = true;

      autocomplete.updateSuggestions(<any>{ suggestions, navigations, category: { values: categoryValues }, products });

      expect(set).to.be.calledWith({ suggestions, navigations, categoryValues, products, selected: -1 });
      expect(setActivation).to.be.calledWith(targets, selected, false);
    });

    it('should inactivate sayt when there are no suggestions nor products', () => {
      const emit = spy();
      autocomplete.flux = <any>{ emit };
      autocomplete.set = () => null;

      autocomplete.updateSuggestions(<any>{ suggestions: [], navigations: [], products: [], category: { values: [] } });

      expect(emit).to.be.calledWith('sayt:hide');
    });

    it('should activate sayt when there are suggestions and no products', () => {
      const emit = spy();
      autocomplete.flux = <any>{ emit };
      autocomplete.set = () => null;

      autocomplete.updateSuggestions(<any>{
        suggestions,
        navigations,
        products: [],
        category: { values: categoryValues },
      });

      expect(emit).to.be.calledWith('sayt:show');
    });

    it('should activate sayt when there are only products and no suggestions', () => {
      const emit = spy();
      autocomplete.flux = <any>{ emit };
      autocomplete.set = () => null;

      autocomplete.updateSuggestions(<any>{ suggestions: [], navigations: [], products, category: { values: [] } });

      expect(emit).to.be.calledWith('sayt:show');
    });

    it('should activate sayt when there are both products and suggestions', () => {
      const emit = spy();
      autocomplete.flux = <any>{ emit };
      autocomplete.set = () => null;

      autocomplete.updateSuggestions(<any>{
        suggestions,
        navigations,
        products: [],
        category: { values: categoryValues },
      });

      expect(emit).to.be.calledWith('sayt:show');
    });
  });

  describe('setActivation()', () => {
    it('should not toggle gb-active if selected is -1', () => {
      const index = -1;
      const state = (autocomplete.state = <any>{ selected: 4 });
      autocomplete.updateProducts = () => null;

      autocomplete.setActivation(<any>[], index, true);

      expect(state.selected).to.eq(index);
    });

    it('should not update products if selected is -1', () => {
      const index = -1;
      const state = (autocomplete.state = <any>{ selected: 4 });
      autocomplete.updateProducts = spy();

      autocomplete.setActivation(<any>[], index, true);

      expect(state.selected).to.eq(index);
      expect(autocomplete.updateProducts).to.not.have.been.called;
    });

    it('should call update products with updateQuery false', () => {
      const index = 0;
      const state = (autocomplete.state = <any>{ selected: 4 });
      const updateProducts = (autocomplete.updateProducts = spy());

      autocomplete.setActivation(<any>[{ classList: { add: () => null } }], index, true, false);

      expect(updateProducts).to.be.calledWithExactly(sinon.match.any, false);
    });

    it('should add gb-active to classList if activating and update state', () => {
      const add = spy();
      const target = { classList: { add } };
      const state = (autocomplete.state = <any>{ selected: 4 });
      const updateProducts = (autocomplete.updateProducts = spy());

      autocomplete.setActivation(<any>[{}, target, {}], 1, true);

      expect(add).to.be.calledWith('gb-active');
      expect(state.selected).to.eq(1);
      expect(updateProducts).to.be.calledWith(target);
    });

    it('should remove gb-active from classList if deactivating', () => {
      const remove = spy();
      const selected = 4;
      const state = (autocomplete.state = <any>{ selected });
      autocomplete.updateProducts = () => null;

      autocomplete.setActivation(<any>[{}, { classList: { remove } }, {}], 1, false);

      expect(remove).to.be.calledWith('gb-active');
      expect(state.selected).to.eq(selected);
    });
  });

  describe('updateProducts()', () => {
    const query = 'salad';

    it('should emit query:update event', () => {
      const emit = spy();
      autocomplete.flux = <any>{ emit, saytProducts: () => null };

      autocomplete.updateProducts(<any>{ dataset: { query } });

      expect(emit).to.be.calledWithExactly('query:update', query);
    });

    it('should not emit query:update event', () => {
      const emit = spy();
      autocomplete.flux = <any>{ emit, saytProducts: () => null };

      autocomplete.updateProducts(<any>{ dataset: { query } }, false);

      expect(emit).to.not.be.called;
    });

    it('should call flux.saytProducts() with only query', () => {
      const saytProducts = spy();
      autocomplete.flux = <any>{ emit: () => null, saytProducts };

      autocomplete.updateProducts(<any>{ dataset: { query } });

      expect(saytProducts).to.be.calledWithExactly(query, []);
    });

    it('should call flux.saytProducts() with original query', () => {
      const saytProducts = spy();
      const state = { a: 'b' };
      select.returns(query);
      autocomplete.flux = <any>{ emit: () => null, saytProducts };

      autocomplete.updateProducts(<any>{ dataset: {} });

      expect(saytProducts).to.be.calledWithExactly(query, []);
      expect(select).to.be.calledWith(Selectors.autocompleteQuery);
    });

    it('should call flux.saytProducts() with only refinement', () => {
      const refinement = 'Nike';
      const field = 'brand';
      const saytProducts = spy();
      autocomplete.flux = <any>{ emit: () => null, saytProducts };

      autocomplete.updateProducts(<any>{ dataset: { query, refinement, field } });

      expect(saytProducts).to.be.calledWithExactly(null, [{ field, value: refinement }]);
    });

    it('should call flux.saytProducts() with query and category refinement', () => {
      const refinement = 'Nike';
      const category = 'brand';
      const saytProducts = spy();
      autocomplete.state = <any>{ category };
      autocomplete.flux = <any>{ emit: () => null, saytProducts };

      autocomplete.updateProducts(<any>{ dataset: { query, refinement } });

      expect(saytProducts).to.be.calledWithExactly(query, [{ field: category, value: refinement }]);
    });

    it('should call flux.pastPurchaseProducts() if past purchase', () => {
      const displaySaytPastPurchases = spy();
      autocomplete.flux = <any>{ emit: () => null, displaySaytPastPurchases };

      autocomplete.updateProducts(<any>{ dataset: { pastPurchase: true, query: 'test' } });

      expect(displaySaytPastPurchases).to.be.calledWithExactly();
    });
  });

  describe('isActive()', () => {
    it('should return true if there is an active selection', () => {
      autocomplete.state = <any>{ selected: 3 };

      expect(autocomplete.isActive()).to.be.true;
    });

    it('should return false if there is no active selection', () => {
      autocomplete.state = <any>{ selected: -1 };

      expect(autocomplete.isActive()).to.be.false;
    });
  });

  describe('state.onHover', () => {
    const targets = [1, 2, 3];
    const matchAny = sinon.match.any;

    it('should call setActivation with updateQuery set to false', () => {
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.activationTargets = stub().returns(targets);
      autocomplete.isActive = stub().returns(true);
      autocomplete.config = <any>{ autocomplete: { hoverAutoFill: false } };
      autocomplete.state.selected = -2;

      autocomplete.state.onHover(<any>{});

      expect(setActivation).to.be.calledTwice;
      expect(setActivation).to.be.calledWithExactly(matchAny, matchAny, matchAny, false);
    });

    it('should call setActivation with updateQuery set to true', () => {
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.activationTargets = stub().returns(targets);
      autocomplete.isActive = stub().returns(true);
      autocomplete.config = <any>{ autocomplete: { hoverAutoFill: true } };
      autocomplete.state.selected = -2;

      autocomplete.state.onHover(<any>{});

      expect(setActivation).to.be.calledTwice;
      expect(setActivation).to.be.calledWithExactly(matchAny, matchAny, matchAny, true);
      expect(setActivation).to.be.calledWithExactly(matchAny, matchAny, matchAny, true);
    });

    it('should call setActivation once when isActive is false', () => {
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.activationTargets = stub().returns(targets);
      autocomplete.state.selected = -2;
      autocomplete.isActive = stub().returns(false);
      autocomplete.config = <any>{ autocomplete: { hoverAutoFill: false } };

      autocomplete.state.onHover(<any>{});

      expect(setActivation).to.be.calledOnce;
    });

    it('should not call setActivation if selected are equal', () => {
      const setActivation = (autocomplete.setActivation = spy());
      autocomplete.activationTargets = stub().returns(targets);
      autocomplete.state.selected = -1;
      autocomplete.isActive = stub().returns(false);
      autocomplete.config = <any>{ autocomplete: { hoverAutoFill: false } };

      autocomplete.state.onHover(<any>{});

      expect(setActivation).to.not.be.called;
    });
  });
});
