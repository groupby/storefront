import { Events, Routes } from '@storefront/flux-capacitor';
import * as sinon from 'sinon';
import Service, { STORAGE_KEY } from '../../../src/services/search';
import Utils from '../../../src/services/urlUtils';
import StoreFront from '../../../src/storefront';
import suite from './_suite';

suite('Search Service', ({ expect, spy, itShouldExtendBaseService, stub }) => {
  let app: StoreFront;
  let service: Service;
  let on: sinon.SinonSpy;

  beforeEach(() => {
    on = spy();
    app = <any>{ flux: { on } };
    service = new Service(app, {});
  });

  describe('constructor()', () => {
    itShouldExtendBaseService(() => service);

    it('should listen for SEARCH_CHANGED', () => {
      expect(on).to.be.calledWithExactly(Events.SEARCH_CHANGED, service.pushState, service);
    });

    it('should listen for SEARCH_URL_UPDATED', () => {
      expect(on).to.be.calledWithExactly(Events.SEARCH_URL_UPDATED, service.fetchProducts, service);
    });
  });

  describe('init()', () => {
    it('should be a no-op', () => {
      expect(() => service.init()).to.not.throw();
    });
  });

  describe('pushState()', () => {
    it('should emit sayt:hide and call pushState', () => {
      const pushState = spy();
      const emit = spy();
      app.flux = <any>{ pushState, emit };

      service.pushState();

      expect(emit).to.be.calledWithExactly('sayt:hide');
      expect(pushState).to.be.calledWith({ route: Routes.SEARCH });
    });
  });

  describe('pushSearchTerm()', () => {
    it('should push the current search term to cookie', () => {
      const term = 'd';
      const get = stub().withArgs(STORAGE_KEY).returns(JSON.stringify(['c', 'b', 'a']));
      const set = spy();
      app.services = <any>{ cookie: { get, set } };

      service.pushSearchTerm(term);

      expect(set).to.be.calledWithExactly(STORAGE_KEY, ['d', 'c', 'b', 'a']);
    });
  });

  describe('fetchProducts()', () => {
    it('should refreshState and dispatch fetchProductsWhenHydrated', () => {
      const urlState: any = { request: { a: 'b' } };
      const state = { c: 'd' };
      const request = { e: 'f' };
      const FETCH = 'FETCH';
      const newState = { g: 'h' };
      const refreshState = spy();
      const dispatch = spy();
      const fetchProductsWhenHydrated = stub().withArgs({ request }).returns(FETCH);
      app.flux = <any>{
        refreshState,
        store: { getState: stub().returns(state), dispatch },
        actions: { fetchProductsWhenHydrated }
      };
      stub(Utils, 'mergeSearchState').withArgs(state, urlState.request).returns(newState);
      stub(Utils, 'searchStateToRequest').withArgs(urlState.request, state).returns(request);

      service.fetchProducts(urlState);

      expect(refreshState).to.be.calledWith(newState);
      expect(dispatch).to.be.calledWith(FETCH);
    });
  });
});
