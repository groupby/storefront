import { tag, Tag } from '@storefront/core';

@tag('gb-paged-list', require('./index.html'))
class PagedList {
  props: PagedList.Props = {
    items: [],
    pageSize: 20,
  };
  state: PagedList.State = {
    items: [],
    page: 1,
  };

  childProps() {
    const { itemAlias, indexAlias } = this.props;
    return { itemAlias, indexAlias, items: this.state.items };
  }

  init() {
    this.updateItems(this.state.page);
  }

  onUpdate() {
    this.updateItems(this.state.page);
  }

  updateItems(newPage: number) {
    const startIndex = this.props.pageSize * (newPage - 1);
    this.state = {
      ...this.state,
      items: this.props.items.slice(startIndex, startIndex + this.props.pageSize),
    };
  }

  onPageChange = (page: number) => {
    this.set({ page });
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
    page: number;
  }

  export type Item = string | ItemObject;

  export type ItemObject = { value: string, onClick: (e: MouseEvent & Tag.Event) => void };
}

export default PagedList;
