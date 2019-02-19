import { consume, tag, Tag } from '@storefront/core';
import RefinementList from '../refinement-list';

@consume('filterControls')
@tag('gb-filtered-refinement-list', require('./index.html'))
class FilteredRefinementList extends RefinementList {
  get alias() {
    return 'filteredRefinements';
  }

  onMount() {
    console.log('mount: ', this.root);
  }

  onUpdate() {
    console.log('update: ', this.root);
  }
}

interface FilteredRefinementList extends RefinementList {}
namespace FilteredRefinementList {
  export interface Props extends RefinementList.Props {
    onFilterFocus?: (event: Tag.Event) => void;
    onSelectAll?: (event: Tag.Event, items: RefinementList.Refinement[]) => void;
    enableSelectAll?: boolean;
  }
}

export default FilteredRefinementList;
