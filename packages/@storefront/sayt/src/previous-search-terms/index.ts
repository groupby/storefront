import { provide, tag, Events, Selectors, Store, Tag } from '@storefront/core';
import Sayt from '../sayt';

@provide('previousSearch', (props) => props)
@tag('gb-sayt-previous-search', require('./index.html'))
class PreviousSearch {
  props: PreviousSearch.Props = {
    onClick: (query) => () => this.actions.search(query),
  } as any;

  constructor() {
    const previousSearches = []
    this.state = {...this.state, previousSearches}
  }

  init() {
    this.flux.on(Events.ORIGINAL_QUERY_UPDATED, this.updatePreviousSearches);
  }

  updatePreviousSearches = (originalQuery: string) => {
    if(!this.state.previousSearches.includes(originalQuery) && this.state.previousSearches.length < 6) {
      this.state.previousSearches.push(originalQuery)
    } else if (!this.state.previousSearches.includes(originalQuery) && this.state.previousSearches.length >= 6) {
      this.state.previousSearches.shift()
      this.state.previousSearches.push(originalQuery)
    }
  }
}

interface PreviousSearch extends Tag<PreviousSearch.Props, PreviousSearch.State> {}
namespace PreviousSearch {
  export interface Props {
    onClick: (query: string) => () => void;;
  }
}

export default PreviousSearch;
