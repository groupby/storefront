import { Events, Routes, Store } from '@storefront/flux-capacitor';
import { core, BaseService } from '../core/service';
import UrlBeautifier from '../core/url-beautifier';
import StoreFront from '../storefront';

@core
class DetailsService extends BaseService<DetailsService.Options> {
  constructor(app: StoreFront, opts: DetailsService.Options) {
    super(app, opts);

    this.app.flux.on(Events.DETAILS_CHANGED, this.pushState, this);
    this.app.flux.on(Events.DETAILS_URL_UPDATED, this.fetchProduct, this);
  }

  init() {
    // no-op
  }

  pushState() {
    this.app.flux.pushState({ route: Routes.DETAILS });
  }

  fetchProduct(urlState: Store.History) {
    this.app.flux.store.dispatch(
      this.app.flux.actions.fetchProductDetails({ id: (<UrlBeautifier.DetailsUrlState>urlState.request).data.id })
    );
  }
}

namespace DetailsService {
  export interface Options {}
}

export default DetailsService;
