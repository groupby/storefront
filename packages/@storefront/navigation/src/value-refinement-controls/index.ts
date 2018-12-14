import { tag, StoreSections, Tag } from '@storefront/core';
import RefinementControls from '../refinement-controls';

@tag('gb-value-refinement-controls', require('./index.html'))
class ValueRefinementControls extends RefinementControls<RefinementControls.Props, ValueRefinementControls.State> {
  actionNames: { [key: string]: string };
  state: ValueRefinementControls.State = {
    moreRefinements: () => this.actions[this.actionNames.fetchMore](this.props.navigation.field),
  };

  get actionCreators(): any {
    return {
      [StoreSections.PAST_PURCHASES]: {
        deselect: 'deselectPastPurchaseRefinement',
        fetchMore: 'fetchMorePastPurchaseRefinements',
        select: 'selectPastPurchaseRefinement',
      },
      [StoreSections.SEARCH]: {
        deselect: 'deselectRefinement',
        fetchMore: 'fetchMoreRefinements',
        select: 'selectRefinement',
      },
    };
  }

  get alias() {
    return 'valueControls';
  }

  init() {
    super.init();
    this.actionNames = this.actionCreators[this.props.storeSection];
  }

  transformNavigation<T extends RefinementControls.SelectedNavigation>(
    navigation: RefinementControls.SelectedNavigation
  ): T {
    return <any>{
      ...navigation,
      refinements: navigation.refinements.map((refinement) => ({
        ...refinement,
        onClick: () => this.actions[refinement.selected ? this.actionNames.deselect : this.actionNames.select](
          this.props.navigation.field,
          refinement.index
        ),
      })),
    };
  }
}

namespace ValueRefinementControls {
  export interface State {
    more?: boolean;
    moreRefinements(): void;
  }

  export interface ActionableNavigation extends RefinementControls.SelectedNavigation {
    refinements: ActionableRefinement[];
  }

  export type ActionableRefinement = RefinementControls.SelectedRefinement & {
    onClick: () => void;
  };
}

export default ValueRefinementControls;
