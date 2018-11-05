import { provide, tag, StoreSections, Tag } from '@storefront/core';

@provide('clearRefinement')
@tag('gb-clear-refinement', require('./index.html'))
class ClearRefinement {
  init() {
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.state = { onClick: () => this.actions.deselectPastPurchaseRefinement(this.props.field, this.props.index) };
        break;
      case StoreSections.SEARCH:
        this.state = { onClick: () => this.actions.deselectRefinement(this.props.field, this.props.index) };
        break;
    }
  }
}

interface ClearRefinement extends Tag<ClearRefinement.Props, ClearRefinement.State> {}
namespace ClearRefinement {
  export interface Props extends Tag.Props {
    field: string;
    index: number;
  }

  export interface State {
    onClick(): void;
  }
}

export default ClearRefinement;
