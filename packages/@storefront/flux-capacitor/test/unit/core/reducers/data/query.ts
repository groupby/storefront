import { Actions, Store } from '../../../../../src/core';
import query from '../../../../../src/core/reducers/data/query';
import suite from '../../../_suite';

suite('query', ({ expect }) => {
  const original = 'yelloww';
  const corrected = 'yellow';
  const related = ['red'];
  const didYouMean = ['yell'];
  const rewrites = ['spelling'];
  const state: Store.Query = {
    original, corrected, related, didYouMean, rewrites,
  };

  describe('updateQuery()', () => {
    it('should update original state on UPDATE_QUERY if query is in payload', () => {
      const newOriginal = 'potatoes';
      const newState = {
        ...state,
        original: newOriginal,
      };

      const reducer = query(state, { type: Actions.UPDATE_QUERY, payload: newOriginal });

      expect(reducer).to.eql(newState);
    });

    it('should update state on RECEIVE_QUERY', () => {
      const payload: any = {
        corrected: 'potato chips',
        related: [],
        didYouMean: [{ value: 'lays potato chips', url: '/chips' }],
        rewrites: [],
      };
      const newState = {
        ...state,
        ...payload,
        original: undefined,
      };

      const reducer = query(state, { type: Actions.RECEIVE_QUERY, payload });

      expect(reducer).to.eql(newState);
    });

    it('should return state on default', () => {
      const reducer = query(state, <any>{});

      expect(reducer).to.eql(state);
    });
  });
});
