import { provide, tag, Tag } from '@storefront/core';
import List from '../list';

@provide('infiniteList', (props) => props)
@tag('gb-infinite-list', require('./index.html'), require('./index.css'))
class InfiniteList extends List {
  onMount() {
    // the following is a hotfix to a known riot.js bug; this allows `opts._props` to be parsed as `props`
    // the riot.js bug is detailed here: https://github.com/riot/riot/issues/2655
    // todo: Remove this if a riot.js maintainer resolves the issue, or if StoreFront transtions to the React framework.
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
