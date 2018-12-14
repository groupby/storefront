import { provide, tag, Tag } from '@storefront/core';

@provide('paging')
@tag('gb-generic-paging', require('./index.html'))
class GenericPaging {
  props: GenericPaging.Props = {
    showIcons: true,
    showLabels: true,
    numericLabels: false,
    labels: { first: 'First', next: 'Next', prev: 'Prev', last: 'Last' },
    limit: 5,
    icons: {},
  };

  firstPage = () => {
    if (typeof this.props.firstPage === 'function') {
      this.props.firstPage();
    }
  };

  lastPage = () => {
    if (typeof this.props.lastPage === 'function') {
      this.props.lastPage();
    }
  };

  prevPage = () => {
    if (typeof this.props.prevPage === 'function') {
      this.props.prevPage();
    }
  };

  nextPage = () => {
    if (typeof this.props.nextPage === 'function') {
      this.props.nextPage();
    }
  };
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
    limit?: number;
    icons?: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };

    firstPage?: () => void;
    lastPage?: () => void;
    prevPage?: () => void;
    nextPage?: () => void;
    switchPage?: (page: number) => void;
  }
}

export default GenericPaging;
