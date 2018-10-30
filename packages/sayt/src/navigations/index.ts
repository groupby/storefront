import { provide, tag, Tag } from '@storefront/core';

@provide('navigations')
@tag('gb-sayt-navigations', require('./index.html'))
class Navigations {
  state: Navigations.State = {
    onClick: (navigationId, value) => () =>
      this.actions.updateSearch({
        clear: true,
        query: null,
        navigationId,
        value,
      }),
  };
}

interface Navigations extends Tag<Navigations.Props, Navigations.State> {}
namespace Navigations {
  export interface Props {
    items: any[];
  }

  export interface State {
    onClick: (field: string, value: string) => () => void;
  }
}

export default Navigations;
