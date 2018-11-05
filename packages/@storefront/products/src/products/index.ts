import * as Core from '@storefront/core';
import Product = Core.Store.ProductWithMetadata;

export type Transformer = (product: Product) => { data: object; variants: object[]; meta: any };

@Core.configurable
@Core.provide('products')
@Core.tag('gb-products', require('./index.html'))
class Products {
  state: Products.State = {
    products: [],
  };

  init() {
    // we force an update on init to avoid race condition issues
    switch (this.props.storeSection) {
      case Core.StoreSections.PAST_PURCHASES:
        this.subscribe(Core.Events.PAST_PURCHASE_PRODUCTS_UPDATED, this.updatePastPurchaseProducts);
        this.updatePastPurchaseProducts(this.select(Core.Selectors.pastPurchaseProducts));
        break;
      case Core.StoreSections.SEARCH:
        this.subscribe(Core.Events.PRODUCTS_UPDATED, this.updateProducts);
        this.updateProducts();
        break;
    }
  }

  productTransformer: Transformer = ({ data, meta }: Product) => ({
    ...Core.ProductTransformer.transformer(this.config.structure)(data),
    meta,
  });

  updateProducts = () => {
    const products = this.select(Core.Selectors.productsWithPastPurchase, this.config.recommendations.idField);
    this.set({
      products: products.map(this.productTransformer),
    });
  };

  updatePastPurchaseProducts = (products: any = []) =>
    this.set({
      products: products.map(({ meta, ...data }) => ({ data, meta })).map(this.productTransformer),
    });
}

interface Products extends Core.Tag<Core.Tag.Props, Products.State> {}
namespace Products {
  export interface State {
    products: any[];
  }
}

export default Products;
