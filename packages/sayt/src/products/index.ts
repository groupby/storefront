import { provide, tag, Events, ProductTransformer, Selectors, Store, Structure, Tag } from '@storefront/core';

@provide('saytProducts')
@tag('gb-sayt-products', require('./index.html'))
class Products {
  structure: Structure = this.config.structure;
  state: Products.State = {
    products: [],
  };

  init() {
    this.services.autocomplete.registerProducts(this);
    this.subscribe(Events.AUTOCOMPLETE_PRODUCTS_UPDATED, this.updateProducts);

    this.updateProducts(this.select(Selectors.autocompleteProducts));
  }

  updateProducts = (products: Store.Product[]) =>
    this.set({
      products: products.map(ProductTransformer.transformer(this.structure)),
    });
}

interface Products extends Tag<any, Products.State> {}
namespace Products {
  export interface State {
    products: any[];
  }
}

export default Products;
