import { provide, tag, Tag } from '@storefront/core';

@provide('refinementCrumb')
@tag('gb-refinement-crumb', require('./index.html'))
class RefinementCrumb {
  init() {
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    let label;

    if (this.props.range) {
      label = this.props.low + ' - ' + this.props.high;
    } else if (this.props.boolean) {
      label = this.props.navigationLabel;
    } else {
      label = this.props.value;
    }

    this.state = {
      ...this.props,
      label,
    }
  }
}

interface RefinementCrumb extends Tag<RefinementCrumb.Props> {}
namespace RefinementCrumb {
  export interface Props extends Tag.Props {
    field?: string;
    boolean?: boolean;
    navigationLabel?: string;
    range?: boolean;
    high?: number;
    low?: number;
    value?: string;
  }

  export interface State extends RefinementCrumb.Props {
    label: string;
  }
}

export default RefinementCrumb;
