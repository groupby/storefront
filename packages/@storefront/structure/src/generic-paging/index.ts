import { provide, tag, Tag } from '@storefront/core';

@provide('paging')
@tag('gb-generic-paging', require('./index.html'))
class GenericPaging {
  props: GenericPaging.Props = {
    showIcons: true,
    showLabels: true,
    numericLabels: false,
    labels: { first: 'First', next: 'Next', prev: 'Prev', last: 'Last' },
    icons: {},
    pageSize: 20,
    current: 1,
    itemCount: 0,
    limit: 5,
  };

  state: GenericPaging.State = {
    range: [],
    lowOverflow: false,
    highOverflow: false,
    firstPage: () => {
      if (typeof this.props.onFirstPage === 'function') {
        this.props.onFirstPage();
      }
    },
    lastPage: () => {
      if (typeof this.props.onLastPage === 'function') {
        this.props.onLastPage();
      }
    },
    prevPage: () => {
      if (typeof this.props.onPrevPage === 'function') {
        this.props.onPrevPage();
      }
    },
    nextPage: () => {
      if (typeof this.props.onNextPage === 'function') {
        this.props.onNextPage();
      }
    },
    switchPage: (page: number) => () => {
      if (typeof this.props.onSwitchPage === 'function') {
        this.props.onSwitchPage(page);
      }
    },
  }

  init() {
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    const { itemCount, pageSize, current, limit } = this.props;

    this.state = {
      ...this.state,
      ...this.props,
    };
    this.updateRange(itemCount, pageSize, current, limit);
  }

  updateRange(itemCount: number, pageSize: number, current: number, limit: number) {
    const lastPage = Math.ceil(itemCount / pageSize);
    const range = GenericPaging.generateRange(
      lastPage,
      current,
      limit
    );

    this.state = {
      ...this.state,
      range,
      lowOverflow: range[0] > 1,
      highOverflow: range[range.length - 1] < lastPage,
    };
  }

  static generateRange(lastPage: number, current: number, limit: number) {
    const last = Math.min(lastPage, limit);
    const border = Math.floor(limit / 2);
    if (current <= border) {
      return GenericPaging.range(1, last);
    } else if (current >= lastPage - border) {
      return GenericPaging.range(lastPage - last + 1, lastPage);
    } else {
      return GenericPaging.range(current - border, current + border);
    }
  }

  static range(low: number, high: number) {
    const arr = new Array(high - low + 1);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i + low;
    }
    return arr;
  }
}

interface GenericPaging extends Tag<GenericPaging.Props> {}
namespace GenericPaging {
  export interface Props extends Tag.Props {
    showIcons?: boolean;
    showLabels?: boolean;
    numericLabels?: boolean;
    labels?: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
    icons?: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
    pageSize?: number;
    current?: number;
    itemCount?: number;
    limit?: number;

    onFirstPage?: () => void;
    onLastPage?: () => void;
    onPrevPage?: () => void;
    onNextPage?: () => void;
    onSwitchPage?: (page: number) => void;
  }

  export interface State extends GenericPaging.Props {
    range: number[];
    lowOverflow: boolean;
    highOverflow: boolean;
    firstPage?: () => void;
    lastPage?: () => void;
    prevPage?: () => void;
    nextPage?: () => void;
    switchPage?: (page: number) => () => void;
  }
}

export default GenericPaging;
