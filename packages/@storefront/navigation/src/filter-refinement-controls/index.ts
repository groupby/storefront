import { tag, StoreSections, Tag } from '@storefront/core';
import RefinementControls from '../refinement-controls';
import ValueRefinementControls from '../value-refinement-controls';

@tag('gb-filter-refinement-controls', require('./index.html'))
class FilterRefinementControls extends ValueRefinementControls {
  get alias() {
    return 'filterControls';
  }

  get selectMultipleRefinements(): string {
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        return 'selectMultiplePastPurchaseRefinements';
      case StoreSections.SEARCH:
        return 'selectMultipleRefinements';
    }
  }

  fetchMoreRefinements = () => {
    if (this.state.more) {
      this.state.moreRefinements();
    }
  }

  selectMatchedRefinements = (event: Tag.Event, refinements: RefinementControls.SelectedRefinement[]) => {
    this.actions[this.selectMultipleRefinements](this.props.navigation.field, refinements.map((refinement) => refinement.index));
  }
}

export default FilterRefinementControls;
