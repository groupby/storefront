import { provide, tag, Selectors, Store, Tag } from '@storefront/core';

@provide('product')
@tag('gb-product', require('./index.html'))
class Product {
  props: Product.Props = {
    product: {
      data: {},
      variants: [],
    },
  };
  state: Product.State = {
    data: {},
    variants: [],
    persistent: 0,
    link: () => {
      return this.services.url.beautifier.build('details', {
        data: this.state.data,
        variants: [],
      });
    },
    onClick: () => this.flux.detailsWithRouting(this.select(Selectors.findProduct, this.state.data.id)),
    onSelect: (index, persist) => {
      if (index === -1) {
        this.set({ selected: this.props.product.variants[this.state.persistent] });
      } else if (index < this.props.product.variants.length) {
        const selected = this.props.product.variants[index];
        this.set(persist ? { selected, persistent: index } : { selected });
      }
    },
  };

  init() {
    this.state = { ...this.state, ...this.props.product };
  }

  onUpdate() {
    this.state = {
      ...this.state,
      ...this.props.product,
      data: this.state.selected || this.props.product.data || this.state.data,
    };
  }
}

interface Product extends Tag<Product.Props, Product.State> {}
namespace Product {
  export interface Props extends Tag.Props {
    product: {
      data: any;
      variants: any[];
    };
  }

  export interface State {
    selected?: any;
    persistent: number;
    data: any;
    variants: any[];
    link(): string;
    onClick(): void;
    onSelect(index: number, persist?: boolean): void;
  }
}

export default Product;
