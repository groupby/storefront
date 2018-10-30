import { configurable, provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@configurable
@provide('pageSize')
@tag('gb-page-size', require('./index.html'))
class PageSize {
  state: PageSize.State = {
    pageSizes: [],
    onSelect: (index) => {
      switch (this.props.storeSection) {
        case StoreSections.SEARCH:
          this.actions.updatePageSize(this.state.pageSizes[index].value);
          break;
        case StoreSections.PAST_PURCHASES:
          this.actions.updatePastPurchasePageSize(this.state.pageSizes[index].value);
          break;
      }
    },
  };

  init() {
    switch (this.props.storeSection) {
      case StoreSections.SEARCH:
        this.subscribe(Events.PAGE_SIZE_UPDATED, this.updatePageSizes);
        this.set({ pageSizes: this.selectPageSizes(this.select(Selectors.pageSizes)) });
        break;
      case StoreSections.PAST_PURCHASES:
        this.subscribe(Events.PAST_PURCHASE_PAGE_SIZE_UPDATED, this.updatePageSizes);
        this.set({ pageSizes: this.selectPageSizes(this.select(Selectors.pastPurchasePageSizes)) });
        break;
    }
  }

  updatePageSizes = (state: Store.SelectableList<number>) => this.set({ pageSizes: this.selectPageSizes(state) });

  selectPageSizes(state: Store.SelectableList<number>) {
    return state.items.map((pageSize, index) => ({
      value: pageSize,
      label: pageSize,
      selected: index === state.selected,
    }));
  }
}

interface PageSize extends Tag<any, PageSize.State> {}
namespace PageSize {
  export interface State {
    pageSizes: Option[];
    onSelect(index: number): void;
  }

  export interface Option {
    value: number;
    label: number;
    selected?: boolean;
  }
}

export default PageSize;
