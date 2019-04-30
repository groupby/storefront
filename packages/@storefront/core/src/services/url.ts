import { Store, STOREFRONT_APP_ID } from '@storefront/flux-capacitor';
import { core, BaseService } from '../core/service';
import UrlBeautifier from '../core/url-beautifier';
import { DOMEXCEPTION_NAMES, WINDOW } from '../core/utils';
import StoreFront from '../storefront';
import Utils from './urlUtils';

@core
class UrlService extends BaseService<UrlService.Options> {
  static getBasePath: typeof Utils.getBasePath = Utils.getBasePath;

  beautifier: UrlBeautifier.SimpleBeautifier;

  urlState: UrlService.UrlStateFunctions = {
    search: Utils.searchUrlState,
    details: Utils.detailsUrlState,
    navigation: Utils.navigationUrlState,
    pastpurchase: Utils.pastPurchaseUrlState,
  };

  history: UrlService.History;

  constructor(app: StoreFront, opts: UrlService.Options) {
    super(app, opts);

    if (typeof this.opts.beautifier === 'function') {
      this.beautifier = this.opts.beautifier(this.app, this.generateRoutes());
    } else {
      this.beautifier = new UrlBeautifier(this.generateRoutes(), this.opts.beautifier, this.app.config);
    }

    this.history = {
      pushState: this.opts.history && typeof this.opts.history.pushState === 'function'
        ? this.opts.history.pushState
        : WINDOW().history.pushState.bind(WINDOW().history),
      replaceState: this.opts.history && typeof this.opts.history.replaceState === 'function'
        ? this.opts.history.replaceState
        : WINDOW().history.replaceState.bind(WINDOW().history),
      initialUrl: this.opts.history && this.opts.history.initialUrl
        ? this.opts.history.initialUrl
        : WINDOW().location.href,
      listener: this.opts.history && typeof this.opts.history.listener === 'function'
        ? this.opts.history.listener
        : WINDOW().addEventListener.bind(WINDOW()),
    };
  }

  init() {
    this.app.flux.initHistory({
      build: this.build,
      parse: this.parse,
      initialUrl: this.initialUrl,
      pushState: this.pushState,
      replaceState: this.replaceState,
    });

    this.historyListener(this.rewind);
  }

  parse = (url: string) => {
    return new Promise<{ route: string, request: any }>((resolve, reject) => {
      try {
        const parsed = this.beautifier.parse<UrlBeautifier.SearchUrlState>(url);
        resolve(parsed);
      } catch (e) {
        this.app.log.warn('UrlService parse promise failed', e);
        reject(e);
      }
    });
  }

  build = (route: string, state: Store.State) => {
    return this.beautifier.build(route, this.urlState[route](state));
  }

  get pushState() {
    if (typeof this.opts.urlHandler === 'function') {
      return (data, title, url) => this.opts.urlHandler(url);
    } else {
      return (data, title, url) => {
        const redirectFnResult = typeof this.opts.redirects === 'function'
          ? this.opts.redirects(url)
          : this.opts.redirects[url];
        if (redirectFnResult) {
          WINDOW().location.assign(redirectFnResult);
          this.app.flux.store.dispatch(this.app.flux.actions.startRedirect());
          return;
        } else {
          try {
            return this.history.pushState(data, title, url);
          } catch (e) {
            if (e.name === DOMEXCEPTION_NAMES.SECURITY_ERROR) {
              // if a SecurityError is thrown, the URL is probably not in the same origin
              // hard-navigate to the URL instead
              return WINDOW().location.assign(url);
            } else {
              // rethrow the error for all other cases to prevent infinite loops
              throw e;
            }
          }
        }
      };
    }
  }

  get replaceState() {
    return (data, title, url) => {
      try {
        return this.history.replaceState(data, title, url);
      } catch (e) {
        if (e.name === DOMEXCEPTION_NAMES.SECURITY_ERROR) {
          // if a SecurityError is thrown, the URL is probably not in the same origin
          // hard-navigate to the URL instead
          return WINDOW().location.replace(url);
        } else {
          // rethrow the error for all other cases to prevent infinite loops
          throw e;
        }
      }
    };
  }

  get initialUrl() {
    return this.history.initialUrl;
  }

  historyListener(cb: (e: PopStateEvent) => void) {
    return this.history.listener('popstate', cb);
  }

  generateRoutes() {
    const basePath = Utils.getBasePath();
    const routes = this.opts.routes;

    return Object.keys(routes).reduce(
      (generatedRoutes: any, prop) => Object.assign(generatedRoutes, { [prop]: basePath + routes[prop] }),
      {}
    );
  }

  rewind = (event: PopStateEvent) => {
    const eventState = event.state;
    if (eventState && event.state.app === STOREFRONT_APP_ID) {
      this.app.flux.refreshState(eventState.state);
      if (this.app.config.history.length === 0) {
        this.app.flux.store.dispatch(this.app.flux.actions.fetchProductsWithoutHistory());
      }
    }
  }
}

namespace UrlService {
  export interface Options {
    beautifier?: UrlBeautifier.Configuration | UrlBeautifier.Factory;
    routes?: Routes;
    redirects?: { [target: string]: string } | ((url: string) => any);
    urlHandler?: (url: string) => void;
    history?: UrlService.History;
  }

  export interface Routes {
    search: string;
    details: string;
    navigation: string;
    pastpurchase: string;
  }

  export type UrlStateFunction = (state: any) => any;

  export interface UrlStateFunctions {
    search: UrlStateFunction;
    details: UrlStateFunction;
    navigation: UrlStateFunction;
    pastpurchase: UrlStateFunction;
  }

  export interface History {
    pushState: (data: any, title: string, url: string) => void;
    replaceState: (data: any, title: string, url: string) => void;
    initialUrl: string;
    listener: (str: 'popstate', cb: (e: PopStateEvent) => void) => void;
  }
}

export default UrlService;
