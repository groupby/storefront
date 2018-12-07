import { Events, Routes, Store } from '@storefront/flux-capacitor';
import { core, BaseService } from '../core/service';
import UrlBeautifier from '../core/url-beautifier';
import StoreFront from '../storefront';
import Utils from './urlUtils';

class PastPurchaseService extends BaseService<PastPurchaseService.Options> {

  constructor(app: StoreFront, opts: PastPurchaseService.Options) {
    super(app, opts);

    this.app.flux.on(Events.AUTOCOMPLETE_QUERY_UPDATED, () => this.app.flux.actions.receiveSaytPastPurchases([]));
    this.app.flux.on(Events.PAST_PURCHASE_CHANGED, this.pushState, this);
    this.app.flux.on(Events.PAST_PURCHASE_URL_UPDATED, this.fetchProducts, this);
  }

  init() {
    this.app.flux.store.dispatch(this.app.flux.actions.fetchPastPurchases());
  }

  pushState() {
    this.app.flux.pushState({ route: Routes.PAST_PURCHASE });
  }

  fetchProducts(urlState: Store.History) {
    const state = this.app.flux.store.getState();
    const request = Utils.pastPurchaseStateToRequest(<UrlBeautifier.SearchUrlState>urlState.request, state);
    const newState = Utils.mergePastPurchaseState(state, <UrlBeautifier.SearchUrlState>urlState.request);

    this.app.flux.refreshState(newState);
    this.app.flux.store.dispatch(this.app.flux.actions.fetchPastPurchaseProducts({ request }));
  }
}

namespace PastPurchaseService {
  export interface Options {}
}

export default PastPurchaseService;
