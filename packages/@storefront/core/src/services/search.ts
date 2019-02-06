import { Events, Routes, Selectors, Store } from '@storefront/flux-capacitor';
import { core, BaseService } from '../core/service';
import UrlBeautifier from '../core/url-beautifier';
import StoreFront from '../storefront';
import Utils from './urlUtils';

export const STORAGE_KEY: string = 'gb-previous-search-terms';

@core
class SearchService extends BaseService<SearchService.Options> {
  constructor(app: StoreFront, opts: SearchService.Options) {
    super(app, opts);

    this.app.flux.on(Events.SEARCH_CHANGED, this.pushState, this);
    this.app.flux.on(Events.SEARCH_URL_UPDATED, this.fetchProducts, this);
  }

  init() {
    // no-op
  }

  pushState() {
    this.app.flux.emit('sayt:hide');
    this.app.flux.pushState({ route: Routes.SEARCH });
  }

  pushSearchTerm(term: string) {
    let previousTerms: string[];
    try {
      previousTerms = JSON.parse(this.app.services.cookie.get(STORAGE_KEY));
    } catch (e) {
      this.app.log.warn(`failed to extract previous searches from cookie ${STORAGE_KEY}`, e);
      previousTerms = [];
    }

    previousTerms.unshift(term);

    this.app.services.cookie.set(STORAGE_KEY, previousTerms);
  }

  fetchProducts(urlState: Store.History) {
    const state = this.app.flux.store.getState();
    const request = Utils.searchStateToRequest(<UrlBeautifier.SearchUrlState>urlState.request, state);
    const newState = Utils.mergeSearchState(state, <UrlBeautifier.SearchUrlState>urlState.request);

    this.app.flux.refreshState(newState);
    this.app.flux.store.dispatch(this.app.flux.actions.fetchProductsWhenHydrated({ request }));
  }
}

namespace SearchService {
  export interface Options {}
}

export default SearchService;
