import { Events, Routes } from '@storefront/flux-capacitor';
import * as sinon from 'sinon';
import Service from '../../../src/services/details';
import StoreFront from '../../../src/storefront';
import suite from './_suite';

suite('Details Service', ({ expect, spy, itShouldExtendBaseService, stub }) => {
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

    it('should listen for DETAILS_CHANGED', () => {
      expect(on).to.be.calledWithExactly(Events.DETAILS_CHANGED, service.pushState, service);
    });

    it('should listen for DETAILS_URL_UPDATED', () => {
      expect(on).to.be.calledWithExactly(Events.DETAILS_URL_UPDATED, service.fetchProduct, service);
    });
  });

  describe('init()', () => {
    it('should be a no-op', () => {
      expect(() => service.init()).to.not.throw();
    });
  });

  describe('pushState()', () => {
    it('should save state', () => {
      const pushState = spy();
      app.flux = <any>{ pushState };

      service.pushState();

      expect(pushState).to.be.calledWith({ route: Routes.DETAILS });
    });
  });

  describe('fetchProduct()', () => {
    it('should dispatch fetchProductDetails', () => {
      const id = 12034;
      const urlState: any = { request: { data: { id } } };
      const FETCH = 'FETCH';
      const dispatch = spy();
      const fetchProductDetails = stub().withArgs({ id }).returns(FETCH);
      app.flux = <any>{ store: { dispatch }, actions: { fetchProductDetails } };

      service.fetchProduct(urlState);

      expect(dispatch).to.be.calledWith(FETCH);
    });
  });
});
