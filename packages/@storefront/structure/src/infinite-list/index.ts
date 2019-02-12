import { provide, tag, Tag } from '@storefront/core';
import List from '../list';

@provide('infiniteList', (props) => props)
@tag('gb-infinite-list', require('./index.html'), require('./index.css'))
class InfiniteList extends List {
  onMount() {
    // tslint:disable comment-format
    // XXX: The following is a hotfix to a known riot.js bug; this allows `opts._props` to be parsed as `props`.
    // Source: https://github.com/riot/riot/issues/2655
    // TODO: Remove this if a riot.js maintainer resolves the issue, or if StoreFront transitions to the React framework.
    this.set(true);
  }
}

namespace InfiniteList {
  export interface Props extends List.Props {
    clickPrev: (event: MouseEvent & Tag.Event) => void;
    clickMore: (event: MouseEvent & Tag.Event) => void;
    loaderLabel: string;
    isFetchingForward: boolean;
    isFetchingBackward: boolean;
    loadMore: boolean;
    prevExists?: boolean;
    moreExists?: boolean;
  }
}

export default InfiniteList;
