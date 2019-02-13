import { Events, Routes, Selectors } from '@storefront/flux-capacitor';
import * as sinon from 'sinon';
import Service, { STORAGE_KEY } from '../../../src/services/search';
import Utils from '../../../src/services/urlUtils';
import StoreFront from '../../../src/storefront';
import suite from './_suite';

suite('Search Service', ({ expect, spy, itShouldExtendBaseService, stub }) => {
  const state = { c: 'd' };
  let app: StoreFront;
  let service: Service;
  let on: sinon.SinonSpy;

  beforeEach(() => {
    on = spy();
    app = <any>{ flux: { on, store: { getState: () => state } }, log: { warn: () => null } };
    const opts = {
      maxPastSearchTerms: 3,
      storeDuplicateSearchTerms: false,
    };
    service = new Service(app, opts);
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
      stub(Selectors, 'query');
      app.flux = <any>{ ...app.flux, pushState, emit };
      service.pushSearchTerm = () => null;

      service.pushState();

      expect(emit).to.be.calledWithExactly('sayt:hide');
      expect(pushState).to.be.calledWith({ route: Routes.SEARCH });
    });

    it('should call pushSearchTerm() with the new term', () => {
      const term = 'foo';
      const emit = () => null;
      const pushState = () => null;
      const pushSearchTerm = service.pushSearchTerm = spy();
      const query = stub(Selectors, 'query').withArgs(state).returns(term);
      app.flux = <any>{ ...app.flux, emit, pushState };

      service.pushState();

      expect(pushSearchTerm).to.be.calledWithExactly(term);
    });
  });

  describe('pushSearchTerm()', () => {
    const term = 'foo';
    let set;

    beforeEach(() => {
      set = spy();
      app.services = <any>{ cookie: { set } };
    });

    it('should push the current search term to cookie', () => {
      service.getPastSearchTerms = () => ['a'];

      service.pushSearchTerm(term);

      expect(set).to.be.calledWithExactly(STORAGE_KEY, [term, 'a']);
    });

    it('should limit the past search terms to `maxPastSearchTerms`', () => {
      service.getPastSearchTerms = () => ['c', 'b', 'a'];

      service.pushSearchTerm(term);

      expect(set).to.be.calledWithExactly(STORAGE_KEY, [term, 'c', 'b']);
    });

    it('should deduplicate search terms', () => {
      service.getPastSearchTerms = () => ['b', term, 'a'];

      service.pushSearchTerm(term);

      expect(set).to.be.calledWithExactly(STORAGE_KEY, [term, 'b', 'a']);
    });

    it('should not deduplicate search terms if storeDuplicateSearchTerms is true', () => {
      service = new Service(app, { maxPastSearchTerms: 10, storeDuplicateSearchTerms: true });
      service.getPastSearchTerms = () => ['b', term, 'a'];

      service.pushSearchTerm(term);

      expect(set).to.be.calledWithExactly(STORAGE_KEY, [term, 'b', term, 'a']);
    });

    it('should return the return the final searches', () => {
      service.getPastSearchTerms = () => ['a'];

      const finalSearches = service.pushSearchTerm(term);

      expect(finalSearches).to.eql([term, 'a']);
    });
  });

  describe('getPastSearchTerms()', () => {
    it('should return the past search terms', () => {
      const expectedTerms = ['c', 'b', 'a'];
      const get = stub().withArgs(STORAGE_KEY).returns(JSON.stringify(expectedTerms));
      app.services = <any>{ cookie: { get }};

      const terms = service.getPastSearchTerms();

      expect(terms).to.eql(expectedTerms);
    });

    it('should default to an empty array if there are no previous terms', () => {
      const get = stub().withArgs(STORAGE_KEY).returns(undefined);
      app.services = <any>{ cookie: { get } };

      const terms = service.getPastSearchTerms();

      expect(get).to.be.calledWithExactly(STORAGE_KEY);
      expect(terms).to.eql([]);
    });

    it('should limit to maxPastSearchTerms', () => {
      const get = stub().withArgs(STORAGE_KEY).returns(JSON.stringify(['e', 'd', 'c', 'b', 'a']));
      app.services = <any>{ cookie: { get } };

      const terms = service.getPastSearchTerms();

      expect(terms).to.eql(['e', 'd', 'c']);
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
