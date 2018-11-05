import { provide, tag, Tag } from '@storefront/core';

@provide('swatches')
@tag('gb-swatches', require('./index.html'))
class Swatches {
  state: Swatches.State = {
    onClick: (event) => {
      if (this.props.onClick) {
        this.props.onClick(event.item.i);
      }
    },
    onActivate: (event) => {
      event.preventUpdate = true;
      if (this.props.onChange) {
        this.props.onChange(event.item.i, true);
      }
    },
    onDeactivate: (event) => {
      event.preventUpdate = true;
      if (this.props.onChange) {
        this.props.onChange(event.item.i, false);
      }
    },
  };
}

interface Swatches extends Tag<Swatches.Props, Swatches.State> {}
namespace Swatches {
  export interface Props extends Tag.Props {
    items?: any[];
    onClick(index: number): void;
    onChange(index: number, isActive: boolean): void;
  }

  export interface State {
    onClick(event: Event): void;
    onActivate(event: Event): void;
    onDeactivate(event: Event): void;
  }

  export interface Event extends Tag.Event {
    item: {
      i: number;
    };
  }
}

export default Swatches;
