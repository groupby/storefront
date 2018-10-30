import { provide, tag, Events, ProductTransformer, Selectors, Store, Structure, Tag } from '@storefront/core';

@provide('recommendations')
@tag('gb-recommendations', require('./index.html'))
class Recommendations {
  state: Recommendations.State = {
    products: this.mapProducts(this.select(Selectors.recommendationsProducts)),
  };

  init() {
    this.subscribe(Events.RECOMMENDATIONS_PRODUCTS_UPDATED, this.updateProducts);

    this.updateProducts(this.select(Selectors.recommendationsProducts));
  }

  updateProducts = (products: Store.Product[]) => this.set({ products: this.mapProducts(products) });

  mapProducts(products: Store.Product[]) {
    return products.map(ProductTransformer.transformer(this.config.structure));
  }
}

interface Recommendations extends Tag<any, Recommendations.State> {}
namespace Recommendations {
  export interface State {
    products: any[];
  }
}

export default Recommendations;
