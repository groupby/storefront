import { provide, tag, ProductTransformer, Store, Structure, Tag } from '@storefront/core';
import Zone from '../zone';

@provide('zone')
@tag('gb-products-zone', require('./index.html'))
class ProductsZone {
  onBeforeMount() {
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    const { products, ...zone } = this.props.zone;
    this.state = {
      ...zone,
      products: products.map(ProductTransformer.transformer(this.config.structure)),
    };
  }
}

interface ProductsZone extends Tag<ProductsZone.Props> {}
namespace ProductsZone {
  export interface Props extends Zone.Props {
    zone: Store.ProductsZone;
  }
}

export default ProductsZone;
