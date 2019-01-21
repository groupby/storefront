import { configurable, provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@configurable
@provide('sort')
@tag('gb-sort', require('./index.html'))
class Sort {
  props: Sort.Props = {
    labels: [],
    pastPurchasesLabels: [],
  };
  state: Sort.State = {
    sorts: [],
    onSelect: (index) => {
      switch (this.props.storeSection) {
        case StoreSections.PAST_PURCHASES:
          this.actions.selectPastPurchasesSort(index);
          break;
        case StoreSections.SEARCH:
          this.actions.selectSort(index);
      }
    },
  };

  init() {
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.subscribe(Events.PAST_PURCHASE_SORT_UPDATED, this.updateSorts);
        break;
      case StoreSections.SEARCH:
        this.subscribe(Events.SORTS_UPDATED, this.updateSorts);
        break;
    }

    this.updateSorts();
  }

  onUpdate() {
    this.state = {
      ...this.state,
      sorts: this.extractSorts(),
    };
  }

  updateSorts = () => this.set({ sorts: this.extractSorts() });

  extractSorts() {
    let sorts;
    let labels;
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        sorts = this.select(Selectors.pastPurchaseSort);
        labels = this.props.pastPurchasesLabels && this.props.pastPurchasesLabels.length
          ? this.props.pastPurchasesLabels
          : sorts.labels;
        return sorts.items.map((sort, index) => ({
          label: this.getLabel(sort, index, labels),
          selected: sorts.selected === index,
        }));
      case StoreSections.SEARCH:
        sorts = this.select(Selectors.sorts);
        labels = this.props.labels && this.props.labels.length
          ? this.props.labels
          : sorts.labels;
        return sorts.items.map((sort, index) => ({
          label: this.getLabel(sort, index, labels),
          selected: sorts.selected === index,
        }));
    }
  }

  getLabel(sort: Store.Sort, index: number, labels: string[]) {
    if (index < labels.length) {
      return labels[index];
    } else {
      return `${sort.field} ${sort.descending ? 'Descending' : 'Ascending'}`;
    }
  }
}

interface Sort extends Tag<Sort.Props, Sort.State> {}
namespace Sort {
  export interface Props extends Tag.Props {
    labels?: string[];
    pastPurchasesLabels?: string[];
  }

  export interface State {
    sorts: Option[];
    onSelect(index: number): void;
  }

  export interface Option {
    label: string;
    selected?: boolean;
  }
}

export default Sort;
