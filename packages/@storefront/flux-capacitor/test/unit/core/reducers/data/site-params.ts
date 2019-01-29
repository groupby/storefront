import { Actions, Store } from '../../../../../src/core';
import siteParams from '../../../../../src/core/reducers/data/site-params';
import suite from '../../../_suite';

suite('siteParams', ({ expect }) => {
  const state: Store.SiteParams[] = [{
    key: 'backgroundColor',
    value: '#fff'
  }];

  describe('updateParams', () => {
    it('should return state on RECEIVE_SITE_PARAMS', () => {
      const newParams = [{ key: 'backgroundColor', value: '#999' }, { key: 'extra', value: 'stuffs' }];

      const reducer = siteParams(state, {
        type: Actions.RECEIVE_SITE_PARAMS,
        payload: newParams
      });

      expect(reducer).to.eq(newParams);
    });

    it('should return state on default', () => {
      const reducer = siteParams(state, <any>{});

      expect(reducer).to.eq(state);
    });
  });
});
