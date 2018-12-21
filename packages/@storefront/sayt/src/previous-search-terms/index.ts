<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { provide, tag, Events, Store, Tag } from '@storefront/core';

@provide('previousSearchTerms', (props) => props)
@tag('gb-sayt-previous-search-terms', require('./index.html'))
class PreviousSearchTerms {
  props: PreviousSearchTerms.Props = {
    onClick: (query) => () => this.actions.search(query),
    previousSearchLimit: 5,
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
    if (this.state.previousSearches.length === 0) {
      this.flux.emit('previous:show');
    }
    let previousSearches = this.state.previousSearches;
    if (this.state.previousSearches.indexOf(originalQuery) === -1) {
      if (this.state.previousSearches.length < this.props.previousSearchLimit) {
        previousSearches = [...this.state.previousSearches, originalQuery];
      } else {
        this.state.previousSearches.shift();
        previousSearches = [...this.state.previousSearches, originalQuery];
      }
    } else {
      previousSearches = [...this.state.previousSearches.splice(this.state.previousSearches.indexOf(originalQuery), 1), ...this.state.previousSearches];
    }
    this.set({
      previousSearches
    });
  }
}

interface PreviousSearchTerms extends Tag<PreviousSearchTerms.Props, PreviousSearchTerms.State> {}
namespace PreviousSearchTerms {
  export interface Props {
    onClick: (query: string) => () => void;
    previousSearchLimit?: number;
  }
  export interface State {
    previousSearches?: string[];
  }
}

export default PreviousSearchTerms;
=======
import { provide, tag, Events, Selectors, Store, Tag } from '@storefront/core';
import Sayt from '../sayt';
=======
=======
>>>>>>>  Made initial previous search terms component
import { provide, tag, Events, Tag } from '@storefront/core';
>>>>>>> made requested changes to previousSearches component

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
=======
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
>>>>>>>  Made initial previous search terms component
    }
  }
}

<<<<<<< HEAD
interface PreviousSearchTerms extends Tag<PreviousSearchTerms.Props, PreviousSearchTerms.State> {}
namespace PreviousSearchTerms {
  export interface Props {
    onClick: (query: string) => () => void;
  }
  export interface State {
    previousSearches: string[];
  }
}

<<<<<<< HEAD
export default PreviousSearch;
>>>>>>>  Made initial previous search terms component
=======
export default PreviousSearchTerms;
<<<<<<< HEAD
>>>>>>> changed alias name, wrote initial unit test for previous searches component and added file to bootstrap
=======
=======
interface PreviousSearch extends Tag<PreviousSearch.Props, PreviousSearch.State> {}
namespace PreviousSearch {
  export interface Props {
    onClick: (query: string) => () => void;;
  }
}

export default PreviousSearch;
>>>>>>>  Made initial previous search terms component
>>>>>>>  Made initial previous search terms component