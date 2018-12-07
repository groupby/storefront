import { Actions, Store } from '../../../../../src/core';
import history from '../../../../../src/core/reducers/data/history';
import { Routes } from '../../../../../src/core/utils';
import suite from '../../../_suite';

suite('history', ({ expect }) => {
  const request = { a: 'b' };
  const url = 'www.google.com';
  const route = Routes.SEARCH;
  const state: Store.History = {
    request,
    route,
    url,
    shouldFetch: true,
  };

  describe('updateHistory()', () => {
    it('should update state on UPDATE_HISTORY', () => {
      const newState = {
        request: { c: 'd' },
        url: 'www.example.com',
        route: Routes.DETAILS,
        shouldFetch: false
      };

      const reducer = history(state, {
        type: Actions.UPDATE_HISTORY,
        payload: <any>newState
      });

      expect(reducer).to.eql(newState);
    });

    it('should return state for properties that aren\'t in the payload', () => {
      const newState = {
        url: 'www.example.com',
        route: Routes.DETAILS,
      };

      const reducer = history(state, {
        type: Actions.UPDATE_HISTORY,
        payload: <any>newState
      });

      expect(reducer).to.eql({ ...state, ...newState });
    });

    it('should return state on default', () => {
      const reducer = history(state, <any>{});

      expect(reducer).to.eq(state);
    });
  });
});
