import { provide, tag, Events, Tag } from '@storefront/core';

@provide('previousSearch', (props) => props)
@tag('gb-sayt-previous-search', require('./index.html'))
class PreviousSearch {
  props: PreviousSearch.Props = {
    onClick: (query) => this.actions.search(query),
  };
  state: PreviousSearch.State = {
    previousSearches: [],
  }

  constructor() {
    this.updatePreviousSearches = this.updatePreviousSearches.bind(this);
  }

  init() {
    this.subscribe(Events.ORIGINAL_QUERY_UPDATED, this.updatePreviousSearches);
  }


  updatePreviousSearches(originalQuery: string) {
    if (!this.state.previousSearches.includes(originalQuery)) {
      if (this.state.previousSearches.length < 6) { // to be set in the storefront config
        this.state.previousSearches = [...this.state.previousSearches, originalQuery];
      } else {
        this.state.previousSearches.shift();
        this.state.previousSearches = [...this.state.previousSearches, originalQuery];
      }
    }
  }
}

interface PreviousSearch extends Tag<PreviousSearch.Props, PreviousSearch.State> {}
namespace PreviousSearch {
  export interface Props {
    onClick: (query: string) => void;
  }
  export interface State {
    previousSearches: string[];
  }
}

export default PreviousSearch;
