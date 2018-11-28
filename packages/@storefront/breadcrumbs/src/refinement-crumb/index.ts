import { provide, tag, Tag } from '@storefront/core';

@provide('refinementCrumb')
@tag('gb-refinement-crumb', require('./index.html'))
class RefinementCrumb {
  init() {
    this.state = {
      ...this.props,
    }
  }
}

interface RefinementCrumb extends Tag<RefinementCrumb.Props> {}
namespace RefinementCrumb {
  export interface Props extends Tag.Props {
    field?: string;
    boolean?: boolean;
    range?: boolean;
    high?: number;
    low?: number;
    value?: string;
  }
}

export default RefinementCrumb;
