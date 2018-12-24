import { Biasing, Sort } from 'groupby-api';
import { SORT_ENUMS } from '../reducers/data/past-purchases';
import Selectors from '../selectors';
import Store from '../store';

namespace PastPurchasesAdapter {

  export const buildUrl = (customerId: string, endpoint: string) =>
    `https://${customerId}.groupbycloud.com/orders/v1/public/skus/${endpoint}`;

// tslint:disable-next-line max-line-length
  export const pastPurchaseBiasing = (state: Store.State) => {
    const { recommendations: { idField, pastPurchases } } = Selectors.config(state);
    return {
      bringToTop: [],
      augmentBiases: true,
      influence: pastPurchases.biasInfluence,
      biases: Selectors.pastPurchases(state)
        .slice(0, pastPurchases.biasCount)
        .map((pastPurchase) => ({ name: idField, content: pastPurchase.sku, strength: pastPurchases.biasStrength }))
    };
  };

  // maps an array of products to an object with ids as keys and product data as value

  export const pastPurchaseProducts = (products: Store.ProductWithMetadata[]) => {
    return products.reduce((productMap, product) => {
      productMap[product.data.id] = product;
      return productMap;
    }, {});
  };

  export const sortSkus = (skus: Store.PastPurchases.PastPurchaseProduct[], field: string) => {
    return [...skus].sort(({ [field]: lhs }, { [field]: rhs }) => rhs - lhs);
  };

  export const sortSkusByType = (skus: Store.PastPurchases.PastPurchaseProduct[], type: number = -1) => {
    switch (type) {
      case SORT_ENUMS.MOST_PURCHASED: return PastPurchasesAdapter.sortSkus(skus, 'quantity');
      case SORT_ENUMS.MOST_RECENT: return PastPurchasesAdapter.sortSkus(skus, 'lastPurchased');
      default: return skus;
    }
  };

  export const biasSkus = (state: Store.State) => {
    const ids: string[] = Selectors.pastPurchases(state).map(({ sku }) => sku);

    return {
      biasing: <Biasing>{
        restrictToIds: ids,
      },
      sort: <Sort[]>[{ type: 'ByIds', ids }],
    };
  }
}

export default PastPurchasesAdapter;
