import { STOREFRONT_APP_ID } from '@storefront/flux-capacitor';
import * as UrlBeautifier from '../../../src/core/url-beautifier';
import * as CoreUtils from '../../../src/core/utils';
import Service from '../../../src/services/url';
import Utils from '../../../src/services/urlUtils';
import suite from './_suite';

suite('URL Service', ({ expect, spy, stub, itShouldBeCore, itShouldExtendBaseService }) => {
  const routes = { a: 'b' };
  const routesWithBase = { a: '/base/b' };
  const beautifier = { refinementMapping: [], queryToken: 'q' };
  const docTitle = 'a title';
  const href = 'www.href.com';
  let service: Service;
  let urlBeautifier;
  let addEventListener;
  let assign;
  let win;
  let winPushState;
  let winReplaceState;
  let generateRoutes;

  beforeEach(() => {
    addEventListener = spy();
    assign = spy();
    winPushState = spy();
    winReplaceState = spy();
    win = {
      addEventListener,
      location: { assign, href },
      history: {
        pushState: winPushState,
        replaceState: winReplaceState,
      },
      document: {
        title: docTitle
      },
    };
    stub(CoreUtils, 'WINDOW').returns(win);
    generateRoutes = stub(Service.prototype, 'generateRoutes').returns(routesWithBase);
    urlBeautifier = stub(UrlBeautifier, 'default');
    service = new Service(<any>{}, <any>{ routes, beautifier });
  });

  itShouldBeCore(Service);

  describe('constructor()', () => {
    const app: any = { a: 'b' };

    itShouldExtendBaseService(() => service);

    it('should create a new URL Beautifier', () => {
      expect(urlBeautifier).to.be.calledWith(routesWithBase, beautifier);
    });

    it('should create a new user-defined beautifier', () => {
      const userBeautifier = { c: 'd' };
      const beautifierFactory = spy(() => userBeautifier);

      service = new Service(app, <any>{ routes, beautifier: beautifierFactory });

      expect(beautifierFactory).to.be.calledWith(app, routesWithBase);
      expect(service.beautifier).to.eq(userBeautifier);
    });

    it('should set up history property with opts properties', () => {
      const pushState = () => null;
      const replaceState = () => null;
      const initialUrl = 'www.example.com';
      const listener = () => null;

      service = new Service(app, <any>{
        history: {
          pushState,
          replaceState,
          initialUrl,
          listener
        }
      });

      expect(service.history.pushState).to.eq(pushState);
      expect(service.history.replaceState).to.eq(replaceState);
      expect(service.history.initialUrl).to.eq(initialUrl);
      expect(service.history.listener).to.eq(listener);
    });

    it('should set up history property with window', () => {
      const url = 'www.google.ca';
      const cb = () => null;

      service = new Service(app, <any>{});

      service.history.pushState(null, null, url);
      expect(winPushState).to.be.calledWith(null, null, url);
      service.history.replaceState(null, null, url);
      expect(winReplaceState).to.be.calledWith(null, null, url);
      expect(service.history.initialUrl).to.eq(href);
      service.history.listener('popstate', cb);
      expect(addEventListener).to.be.calledWith('popstate', cb);
    });
  });

  describe('init()', () => {
    it('should call initHistory in flux', () => {
      const initHistory = spy();
      const pushState = spy();
      stub(service, 'pushState').get(() => pushState);
      service['app'].flux = <any>{ initHistory };

      service.init();

      const initHistoryArgs = initHistory.getCall(0).args[0];
      expect(initHistoryArgs.build).to.eq(service.build);
      expect(initHistoryArgs.parse).to.eq(service.parse);
      expect(initHistoryArgs.initialUrl).to.eq(service.initialUrl);
      expect(initHistoryArgs.replaceState).to.eq(service.replaceState);
      initHistoryArgs.pushState();
      expect(pushState).to.be.called;
    });

    it('should set up history listener', () => {
      const initialUrl = 'www.example.com/ayylmao';
      const historyListener = service.historyListener = spy();
      const rewind = service.rewind = spy();
      stub(service, 'initialUrl').returns(initialUrl);
      service['app'].flux = <any>{ initHistory: () => null };

      service.init();
      const historyListenerArg = historyListener.getCall(0).args[0];

      historyListenerArg();
      expect(rewind).to.be.called;
    });
  });

  describe('parse()', () => {
    it('should call the beautifier parser, and resolve when successful', () => {
      const url = 'www.example.com';
      const parsed = { route: 'search', request: { a: 'b' } };
      const parse = spy(() => parsed);
      service.beautifier = <any>{ parse };

      const result = service.parse(url);

      expect(parse).to.be.calledWith(url);
      return result.then((resp) => (expect(resp).to.eq(parsed)));
    });

    it('should log error', () => {
      const url = 'www.example.com';
      const parse = spy();
      const warn = spy();
      const err = new Error('its an error');
      service.beautifier = <any>{ parse: () => { throw err; } };
      service['app'] = <any>{ log: { warn } };

      return service.parse(url).catch((e) => {
        expect(warn).to.be.calledWith('UrlService parse promise failed', err);
        expect(e).to.eq(err);
      });
    });
  });

  describe('build()', () => {
    it('should call the beautifier build', () => {
      const route = 'search';
      const state: any = { a: 'b' };
      const build = spy();
      const urlState = { c: 'd' };
      const search = stub().withArgs(state).returns(urlState);
      service.beautifier = <any>{ build };
      service.urlState = <any>{ search };

      service.build(route, state);

      expect(build).to.be.calledWith(route, urlState);
    });
  });

  describe('get pushState()', () => {
    const url = 'www.example.com';

    it('should use the opts urlHandler if it is a function', () => {
      const urlHandler = spy();
      service['opts'] = <any>{ urlHandler };

      service.pushState(null, null, url);

      expect(urlHandler).to.be.calledWith(url);
    });

    it('should use the opts redirects if it is a function', () => {
      const redirectsResult = 'www.redirect.com';
      const redirects = stub().withArgs(url).returns(redirectsResult);
      service['opts'] = <any>{ redirects };

      service.pushState(null, null, url);

      expect(assign).to.be.calledWith(redirectsResult);
    });

    it('should use the opts redirects if it is an object', () => {
      const redirectsResult = 'www.redirect.com';
      service['opts'] = <any>{
        redirects: {
          [url]: redirectsResult
        }
      };

      service.pushState(null, null, url);

      expect(assign).to.be.calledWith(redirectsResult);
    });

    it('should use the history pushState if it exists', () => {
      const data = { a: 'b' };
      const title = 'this website';
      const pushState = spy();
      service['opts'] = <any>{ redirects: {} };
      service.history = <any>{ pushState };

      service.pushState(data, title, url);

      expect(pushState).to.be.calledWith(data, title, url);
    });
  });

  describe('get replaceState()', () => {
    it('should use the history replaceState', () => {
      const replaceState = spy();
      const data = { a: 'b' };
      const title = 'this website';
      const url = 'www.example.com';
      service.history = <any>{ replaceState };

      service.replaceState(data, title, url);

      expect(replaceState).to.be.calledWith(data, title, url);
    });
  });

  describe('get initialUrl()', () => {
    it('should use the history initialUrl', () => {
      const initialUrl = 'www.example.com/the-best-url';
      service.history = <any>{ initialUrl };

      expect(service.initialUrl).to.eq(initialUrl);
    });
  });

  describe('historyListener()', () => {
    const cb: any = () => null;

    it('should call the history listener', () => {
      const listener = spy(() => null);
      service.history = <any>{ listener };

      service.historyListener(cb);

      expect(listener).to.be.calledWith('popstate', cb);
    });
  });

  describe('generateRoutes()', () => {
    beforeEach(() => generateRoutes.restore());

    it('should generate routes with base path', () => {
      const basePath = '/base';
      const getBasePath = stub(Utils, 'getBasePath').returns(basePath);
      service['opts'] = <any>{ routes: { a: '/b', c: '/d', e: '/f' } };

      expect(service.generateRoutes()).to.eql({
        a: `${basePath}/b`,
        c: `${basePath}/d`,
        e: `${basePath}/f`,
      });
    });
  });

  describe('rewind()', () => {
    it('should refresh state from history', () => {
      const state = { a: 'b' };
      const config = { history: { length: 5 } };
      const refreshState = spy();
      service['app'] = <any>{ config, flux: { refreshState } };

      service.rewind(<any>{ state: { state, app: STOREFRONT_APP_ID } });

      expect(refreshState).to.be.calledWith(state);
    });

    it('should refresh state from history and fetchProductsWithoutHistory when history length is 0', () => {
      const FETCH = 'FETCH';
      const state = { a: 'b' };
      const config = { history: { length: 0 } };
      const refreshState = spy();
      const dispatch = spy();
      const fetchProductsWithoutHistory = stub().returns(FETCH);
      service['app'] = <any>{
        config,
        flux: {
          refreshState,
          store: { dispatch },
          actions: { fetchProductsWithoutHistory }
        }
      };

      service.rewind(<any>{ state: { state, app: STOREFRONT_APP_ID } });

      expect(refreshState).to.be.calledWith(state);
      expect(dispatch).to.be.calledWithExactly(FETCH);
    });

    it('should do nothing if app state is not the storefront app ID', () => {
      const FETCH = 'FETCH';
      const refreshState = spy();
      const dispatch = spy();
      const fetchProductsWithoutHistory = stub().returns(FETCH);
      service['app'] = <any>{
        flux: {
          refreshState,
          store: { dispatch },
          actions: { fetchProductsWithoutHistory }
        }
      };

      service.rewind(<any>{ state: { app: null } });

      expect(refreshState).to.not.be.called;
      expect(dispatch).to.not.be.called;
    });
  });
});
