import * as Core from '@storefront/core';

@Core.configurable
@Core.provide('details')
@Core.tag('gb-details', require('./index.html'))
class Details {
  init() {
    this.subscribe(Core.Events.DETAILS_UPDATED, this.updateDetails);

    const details = this.select(Core.Selectors.details);
    if (details && details.data) {
      this.updateDetails(details.data);
    }
  }

  updateDetails = (product: Core.Store.Product) => {
    if (product) {
      this.set({ product: Core.ProductTransformer.transform(product, this.config.structure) });
    } else {
      this.set({ product: { data: {}, variants: [{}] } });
    }
  }
}

interface Details extends Core.Tag<{}, Details.State> {}

namespace Details {
  export interface State {
    product: { data: object; variants: object[] };
  }
}

export default Details;
