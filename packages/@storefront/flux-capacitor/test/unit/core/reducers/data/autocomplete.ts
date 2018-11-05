import { Actions, Store } from '../../../../../src/core';
import autocomplete from '../../../../../src/core/reducers/data/autocomplete';
import suite from '../../../_suite';

suite('autocomplete', ({ expect }) => {
  const query = 'brown shoes';
  const category = { field: 'a', values: ['b'] };
  const showCategoryValuesForFirstMatch = false;
  const suggestions = [{ value: 'e' }, { value: 'f' }, { value: 'g' }];
  const navigations = [];
  const products = [];
  const state: Store.Autocomplete = {
    category,
    showCategoryValuesForFirstMatch,
    products,
    navigations,
    suggestions,
  };

  describe('updateAutocomplete()', () => {
    it('should update query state on UPDATE_AUTOCOMPLETE_QUERY', () => {
      const payload = 'red shoes';
      const newState = {
        category,
        showCategoryValuesForFirstMatch: false,
        products,
        query: payload,
        navigations,
        suggestions,
      };

      const reducer = autocomplete(state, { type: Actions.UPDATE_AUTOCOMPLETE_QUERY, payload });

      expect(reducer).to.eql(newState);
    });

    it('should update state on RECEIVE_AUTOCOMPLETE_SUGGESTIONS', () => {
      const categoryValues = ['a', 'c', 'd'];
      const newState = {
        category: { ...category, values: categoryValues },
        showCategoryValuesForFirstMatch: false,
        products,
        navigations,
        suggestions,
      };

      const reducer = autocomplete(state, {
        type: Actions.RECEIVE_AUTOCOMPLETE_SUGGESTIONS,
        payload: {
          categoryValues,
          navigations,
          suggestions,
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should update state on RECEIVE_AUTOCOMPLETE_PRODUCT_RECORDS', () => {
      const newProducts = [1, 2, 3];
      const newState = {
        category,
        showCategoryValuesForFirstMatch: false,
        products: newProducts,
        navigations,
        suggestions,
      };

      const reducer = autocomplete(state, <any>{
        type: Actions.RECEIVE_AUTOCOMPLETE_PRODUCT_RECORDS,
        payload: newProducts,
      });

      expect(reducer).to.eql(newState);
    });

    it('should update state on RECEIVE_AUTOCOMPLETE_TEMPLATE', () => {
      const newTemplate = { a: 'b' };
      const newState = {
        category,
        showCategoryValuesForFirstMatch: false,
        products,
        template: newTemplate,
        navigations,
        suggestions,
      };

      const reducer = autocomplete(state, <any>{
        type: Actions.RECEIVE_AUTOCOMPLETE_TEMPLATE,
        payload: newTemplate,
      });

      expect(reducer).to.eql(newState);
    });

    it('should return state on default', () => {
      const reducer = autocomplete(state, <any>{});

      expect(reducer).to.eql(state);
    });
  });
});
