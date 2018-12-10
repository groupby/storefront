import { tag, Tag } from '@storefront/core';

@tag('gb-paged-list', require('./index.html'))
class PagedList {
  props: PagedList.Props = {
    items: [],
    pageSize: 20,
  };
  state: PagedList.State = {
    items: [],
  };

  childProps() {
    const { itemAlias, indexAlias } = this.props;
    return { itemAlias, indexAlias, items: this.state.items };
  }
}

interface PagedList extends Tag<PagedList.Props, PagedList.State> {}
namespace PagedList {
  export interface Props extends Tag.Props {
    items?: Item[];
    itemAlias?: string;
    indexAlias?: string;
    pageSize?: number;
  }

  export interface State {
    items: Item[];
  }

  export type Item = string | ItemObject;

  export type ItemObject = { value: string, onClick: (e: MouseEvent & Tag.Event) => void };
}

export default PagedList;
