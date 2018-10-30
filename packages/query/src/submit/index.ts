import { consume, provide, tag, Tag } from '@storefront/core';
import Query from '../query';

@consume('query')
@provide('submit')
@tag('gb-submit', require('./index.html'))
class Submit {
  $query: Query.State;
  state: Submit.State = {
    onClick: () => this.$query && this.$query.submit(),
  };
}

interface Submit extends Tag<any, Submit.State> {}
namespace Submit {
  export interface State {
    onClick(): void;
  }
}

export default Submit;
