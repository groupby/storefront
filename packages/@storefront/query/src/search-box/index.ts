import { consume, provide, tag, Events, KEYS, Selectors, Tag } from '@storefront/core';
import Query from '../query';

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
    onKeyDown: (event) => [
      KEYS.DOWN,
      KEYS.IE_DOWN,
      KEYS.IE_UP,
      KEYS.UP
    ].indexOf(event.key) !== -1 && event.preventDefault(),
    onKeyUp: (event) => {
      event.preventUpdate = true;
      switch (event.key) {
        case KEYS.ENTER:
          // tslint:disable-next-line
          if (this.services.autocomplete.hasActiveSuggestion()) {
            return this.flux.emit('sayt:select_active');
          } else {
            return this.actions.search(event.target.value);
          }
        case KEYS.IE_ESCAPE:
        case KEYS.ESCAPE:
          return this.flux.emit('sayt:hide');
        case KEYS.IE_UP:
        case KEYS.UP:
          return this.flux.emit('sayt:activate_previous');
        case KEYS.IE_DOWN:
        case KEYS.DOWN:
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
    (originalQuery || '') !== (this.state.originalQuery || this.refs.searchBox.value) && this.set({ originalQuery })
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
