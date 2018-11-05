import { configurable, origin, provide, tag, Events, Tag } from '@storefront/core';
import SearchBox from '../search-box';

@configurable
@provide('query')
@origin('search')
@tag('gb-query', require('./index.html'))
class Query {
  registered: SearchBox[] = [];
  props: Query.Props = {
    mode: 'default',
    showSayt: true,
  };
  state: Query.State = {
    register: (_tag) => this.registered.push(_tag),
    submit: () => {
      if (this.registered.length !== 0) {
        this.actions.search(this.registered[0].refs.searchBox.value);
      }
    },
  };
}

interface Query extends Tag<Query.Props, Query.State> {}
namespace Query {
  export interface Props extends Tag.Props {
    // TODO handle other modes
    mode: 'default' | 'automatic';
    showSayt: boolean;
  }

  export interface State {
    register(tag: SearchBox): void;
    submit(): void;
  }
}

export default Query;
