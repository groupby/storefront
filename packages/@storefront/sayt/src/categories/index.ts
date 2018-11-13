import { provide, tag, Events, Selectors, Tag } from '@storefront/core';
import Autocomplete from '../autocomplete';

@provide('saytCategories')
@tag('gb-sayt-categories', require('./index.html'))
class Categories {
  state: Categories.State = {
    onClick: ({ matchAll, value }) => () =>
      this.actions.updateSearch({
        clear: true,
        query: this.select(Selectors.autocompleteQuery),
        ...(<any>matchAll || {
          navigationId: this.props.category,
          value,
        }),
      }),
    query: this.select(Selectors.autocompleteQuery),
  };

  init() {
    this.subscribe(Events.AUTOCOMPLETE_QUERY_UPDATED, this.updateQuery);
  }

  updateQuery = (query: string) => this.set({ query });
}

interface Categories extends Tag<Categories.Props, Categories.State> {}
namespace Categories {
  export interface Props {
    category: string;
    values: any[];
  }

  export interface State {
    query: string;
    onClick: (category: { value?: string; matchAll?: boolean }) => () => void;
  }
}

export default Categories;
