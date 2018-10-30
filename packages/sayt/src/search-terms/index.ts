import { provide, tag, Selectors, Store, Tag } from '@storefront/core';
import Sayt from '../sayt';

@provide('searchTerms', (props) => props)
@tag('gb-sayt-search-terms', require('./index.html'))
class SearchTerms {
  props: SearchTerms.Props = {
    onClick: (query) => () => this.actions.search(query),
  } as any;
}

interface SearchTerms extends Tag<SearchTerms.Props> {}
namespace SearchTerms {
  export interface Props {
    labels?: Sayt.Labels;
    onClick: (query: string) => () => void;
    suggestions: Store.Autocomplete.Suggestion[];
  }
}

export default SearchTerms;
