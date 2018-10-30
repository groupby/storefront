import { consume, provide, tag, Events, Selectors, Tag } from '@storefront/core';
import Query from '../query';

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_UP = 38;
const KEY_DOWN = 40;

@consume('query')
@provide('searchBox')
@tag('gb-search-box', require('./index.html'))
class SearchBox {
  $query: Query.State;
  refs: { searchBox: HTMLInputElement };
  props: SearchBox.Props = {
    register: false
  };
  state: SearchBox.State = {
    originalQuery: this.select(Selectors.query),
    onKeyDown: (event) => (event.keyCode === KEY_DOWN || event.keyCode === KEY_UP) && event.preventDefault(),
    onKeyUp: (event) => {
      event.preventUpdate = true;
      switch (event.keyCode) {
        case KEY_ENTER:
          if (this.services.autocomplete.hasActiveSuggestion()) {
            return this.flux.emit('sayt:select_active');
          } else {
            return this.actions.search(event.target.value);
          }
        case KEY_ESCAPE:
          return this.flux.emit('sayt:hide');
        case KEY_UP:
          return this.flux.emit('sayt:activate_previous');
        case KEY_DOWN:
          return this.flux.emit('sayt:activate_next');
        default:
          const query = event.target.value;
          if (query && query.length >= this.flux.config.autocomplete.searchCharMinLimit) {
            this.actions.updateAutocompleteQuery(query);
          } else {
            this.flux.emit('sayt:hide');
            this.actions.updateAutocompleteQuery('');
          }
      }
    },
    onClick: (event: MouseEvent & Tag.Event) => {
      event.preventUpdate = true;
      if (!(<HTMLInputElement>event.target).value) {
        this.flux.emit('sayt:show_recommendations');
      }
    },
  };

  init() {
    this.subscribe(Events.ORIGINAL_QUERY_UPDATED, this.updateOriginalQuery);
    this.subscribe('query:update', this.updateOriginalQuery);
  }

  onBeforeMount() {
    if (this.props.register) {
      this.services.autocomplete.registerSearchBox(this);
    }

    if (this.$query) {
      this.$query.register(this);
    }
  }

  onMount() {
    this.updateOriginalQuery(this.select(Selectors.query));
  }

  updateOriginalQuery = (originalQuery: string) =>
    (originalQuery || '') !== (this.state.originalQuery || this.refs.searchBox.value) && this.set({ originalQuery });
}

interface SearchBox extends Tag<SearchBox.Props, SearchBox.State> {}
namespace SearchBox {
  export interface Props {
    register?: boolean;
  }

  export interface State {
    originalQuery?: string;
    onKeyDown(event: InputKeyboardEvent): void;
    onKeyUp(event: InputKeyboardEvent): void;
    onClick(event: Tag.Event): void;
  }

  export interface InputKeyboardEvent extends KeyboardEvent, Tag.Event {
    target: HTMLInputElement;
  }
}

export default SearchBox;
