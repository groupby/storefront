import { provide, tag, Selectors, Store, Tag } from '@storefront/core';
import Sayt from '../sayt';

@provide('pastSearchTerms', (props) => props)
@tag('gb-sayt-past-search-terms', require('./index.html'))
class PastSearchTerms {
  props: PastSearchTerms.Props = {
    label: 'Past Searches',
    onClick: (query) => () => this.actions.search(query),
    pastSearches: [],
  };
}

interface PastSearchTerms extends Tag<PastSearchTerms.Props> {}
namespace PastSearchTerms {
  export interface Props {
    label?: string;
    onClick: (query: string) => () => void;
    pastSearches: string[];
  }
}

export default PastSearchTerms;
