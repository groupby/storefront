import { Events, Routes, Selectors, Store } from '@storefront/flux-capacitor';
import { core, BaseService } from '../core/service';
import UrlBeautifier from '../core/url-beautifier';
import StoreFront from '../storefront';
import Utils from './urlUtils';

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
