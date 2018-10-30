import { tag, Tag } from '@storefront/core';
import RefinementList from '../refinement-list';

@tag('gb-filtered-refinement-list', require('./index.html'))
class FilteredRefinementList extends RefinementList {
  get alias() {
    return 'filteredRefinements';
  }
}

interface FilteredRefinementList extends RefinementList {}
namespace FilteredRefinementList {
  export interface Props extends RefinementList.Props {
    onFilterFocus?: (event: Tag.Event) => void;
  }
}

export default FilteredRefinementList;
