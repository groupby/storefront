import { Events, Selectors } from '@storefront/core';
import * as sinon from 'sinon';
import Categories from '../../src/categories';
import suite from './_suite';

const QUERY = 'red dress';

suite('Categories', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let categories: Categories;
  let select: sinon.SinonStub;

  beforeEach(() => {
    select = Categories.prototype.select = stub().returns(QUERY);
    Categories.prototype.flux = <any>{};
    categories = new Categories();
  });
  afterEach(() => delete Categories.prototype.flux);

  itShouldProvideAlias(Categories, 'saytCategories');

  describe('constructor()', () => {
    describe('state', () => {
      describe('onClick()', () => {
        it('should dispatch actions.updateSearch()', () => {
          const navigationId = 'author';
          const value = 'margaret atwood';
          const query = 'handmaid';
          const action = { a: 'b' };
          const state = { c: 'd' };
          const updateSearch = spy(() => action);
          const handler = categories.state.onClick({ value });

          select.returns(query);
          categories.props = { category: navigationId } as any;
          categories.actions = { updateSearch } as any;
          categories.flux = { store: { getState: () => state } } as any;

          handler();

          expect(updateSearch).to.be.calledWith({ navigationId, value, query, clear: true });
          expect(select).to.be.calledWith(Selectors.autocompleteQuery);
        });
      });

      describe('query', () => {
        it('should equal original autocomplete query', () => {
          expect(categories.state.query).to.eq(QUERY);
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for AUTOCOMPLETE_QUERY_UPDATED', () => {
      const subscribe = (categories.subscribe = spy());

      categories.init();

      expect(subscribe).to.be.calledWithExactly(Events.AUTOCOMPLETE_QUERY_UPDATED, categories.updateQuery);
    });
  });

  describe('updateQuery()', () => {
    it('should update the query', () => {
      const query = 'test';
      const set = (categories.set = spy());

      categories.updateQuery(query);

      expect(set).to.be.calledWithExactly({ query });
    });
  });
});
