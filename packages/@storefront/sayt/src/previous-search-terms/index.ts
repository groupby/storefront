import { provide, tag, Events, Tag } from '@storefront/core';

@provide('previousSearchTerms', (props) => props)
@tag('gb-sayt-previous-search', require('./index.html'))
class PreviousSearchTerms {
  props: PreviousSearchTerms.Props = {
    onClick: (query) => () => this.actions.search(query),
  };
  state: PreviousSearchTerms.State = {
    previousSearches: [],
  }

  constructor() {
    this.updatePreviousSearches = this.updatePreviousSearches.bind(this);
  }

  init() {
    this.subscribe(Events.ORIGINAL_QUERY_UPDATED, this.updatePreviousSearches);
  }


  updatePreviousSearches(originalQuery: string) {
    if (this.state.previousSearches.indexOf(originalQuery) === -1) {
      if (this.state.previousSearches.length < 6) { // to be set in the storefront config
        this.state.previousSearches = [...this.state.previousSearches, originalQuery];
      } else {
        this.state.previousSearches.shift();
        this.state.previousSearches = [...this.state.previousSearches, originalQuery];
      }
    } else {
      this.state.previousSearches = [...this.state.previousSearches.splice(this.state.previousSearches.indexOf(originalQuery), 1), ...this.state.previousSearches]
    }
  }
}

interface PreviousSearchTerms extends Tag<PreviousSearchTerms.Props, PreviousSearchTerms.State> {}
namespace PreviousSearchTerms {
  export interface Props {
    onClick: (query: string) => () => void;
  }
  export interface State {
    previousSearches: string[];
  }
}

export default PreviousSearchTerms;
