import { Events, Routes } from '@storefront/flux-capacitor';
import * as sinon from 'sinon';
import Service from '../../../src/services/pastPurchases';
import Utils from '../../../src/services/urlUtils';
import StoreFront from '../../../src/storefront';
import suite from './_suite';

suite('PastPurchase Service', ({ expect, spy, stub, itShouldExtendBaseService }) => {
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

    it('should listen for AUTOCOMPLETE_QUERY_UPDATED', () => {
      const receiveSaytPastPurchases = spy();
      service['app'].flux.actions = <any>{ receiveSaytPastPurchases };
      expect(on).to.be.calledWith(Events.AUTOCOMPLETE_QUERY_UPDATED);
      on.getCall(0).args[1]();
      expect(receiveSaytPastPurchases).to.be.calledWithExactly([]);
    });

    it('should listen for PAST_PURCHASE_CHANGED', () => {
      expect(on).to.be.calledWithExactly(Events.PAST_PURCHASE_CHANGED, service.pushState, service);
    });

    it('should listen for PAST_PURCHASE_URL_UPDATED', () => {
      expect(on).to.be.calledWithExactly(Events.PAST_PURCHASE_URL_UPDATED, service.fetchProducts, service);
    });
  });

  describe('init()', () => {
    it('should fetch past purchase skus', () => {
      const dispatch = spy();
      const fetchPastPurchasesAction = { c: 'f' };
      const fetchPastPurchases = spy(() => fetchPastPurchasesAction);
      service['app'] = <any>{
        flux: {
          store: { dispatch },
          actions: { fetchPastPurchases }
        }
      };

      service.init();

      expect(dispatch).to.be.calledWithExactly(fetchPastPurchasesAction);
      expect(fetchPastPurchases).to.be.called;
    });
  });

  describe('pushState()', () => {
    it('should push state', () => {
      const pushState = spy();
      app.flux = <any>{ pushState };

      service.pushState();

      expect(pushState).to.be.calledWith({ route: Routes.PAST_PURCHASE });
    });
  });

  describe('fetchProducts()', () => {
    it('should refreshState and dispatch fetchPastPurchaseProducts', () => {
      const urlState: any = { request: { a: 'b' } };
      const state = { c: 'd' };
      const request = { e: 'f' };
      const FETCH = 'FETCH';
      const newState = { g: 'h' };
      const refreshState = spy();
      const dispatch = spy();
      const fetchPastPurchaseProducts = stub().withArgs({ request }).returns(FETCH);
      app.flux = <any>{
        refreshState,
        store: { getState: stub().returns(state), dispatch },
        actions: { fetchPastPurchaseProducts }
      };
      stub(Utils, 'mergePastPurchaseState').withArgs(state, urlState.request).returns(newState);
      stub(Utils, 'pastPurchaseStateToRequest').withArgs(urlState.request, state).returns(request);

      service.fetchProducts(urlState);

      expect(refreshState).to.be.calledWith(newState);
      expect(dispatch).to.be.calledWith(FETCH);
    });
  });
});
