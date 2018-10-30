import { consume, tag, utils, Tag } from '@storefront/core';
import Product from '../product';

@consume('product')
@tag('gb-swatch-variant-controls', require('./index.html'))
class SwatchVariantControls {
  $product: Product.State;

  options = () => this.$product.variants.map((variant) => utils.dot.get(variant, this.props.field));

  onClick = (index: number) => this.$product.onSelect && this.$product.onSelect(index, true);

  onSelect = (index: number, isActive: boolean) =>
    this.$product.onSelect && this.$product.onSelect(isActive ? index : -1);
}

interface SwatchVariantControls extends Tag<SwatchVariantControls.Props> {}
namespace SwatchVariantControls {
  export interface Props {
    field: string;
    onSelect(index: number, persist?: boolean);
  }
}

export default SwatchVariantControls;
