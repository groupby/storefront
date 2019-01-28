import { tag, uiState, KEYS, Tag } from '@storefront/core';
import PagedList from '../paged-list';

@uiState()
@tag('gb-filtered-list', require('./index.html'))
class FilteredList {
  refs: { filter: HTMLInputElement };
  props: FilteredList.Props = <any>{
    items: [],
    paginate: true,
    enableSelectAll: false,
    selectAllLabel: 'Select All',
    uiValue: 'whatevs',
  };
  state: FilteredList.State = {
    items: [],
    inputValue: '',
  };

  childProps() {
    const { itemAlias, indexAlias } = this.props;
    const props: PagedList.Props = { itemAlias, indexAlias, items: this.state.items };

    if (!this.props.paginate) {
      props.pageSize = props.items.length;
    }
    debugger;

    return props;
  }

  onMount() {
    // TODO: take out changes to this file/repo & navigations
    if (!this.state.items.length) {
      this.updateItems('');
      this.set(true);
    }
  }

  onUpdated() {
    debugger;
  }

  onUpdate() {
    if (this.state.items.length !== 2) {
      this.updateItems();
    }
  }

  onKeyDown(event: KeyboardEvent & Tag.Event) {
    event.preventUpdate = true;
    if (event.key !== KEYS.ENTER) {
      return;
    }

    const value = this.refs.filter.value.trim().toLowerCase();
    const foundItem: FilteredList.ItemObject = <FilteredList.ItemObject>(this.state.items.length === 1
      ? this.state.items[0]
      : this.props.items.find((el) => {
        const item: FilteredList.ItemObject = <FilteredList.ItemObject>el;
        return item && item.value && item.value.toLowerCase() === value;
      }));

    if (foundItem && typeof foundItem.onClick === 'function') {
      foundItem.onClick(<any>event);
    }
  }

  onFilterChange(event: Tag.Event) {
    event.preventUpdate = true;
    this.set(true);
  }

  onFilterFocus(event: Tag.Event & FocusEvent) {
    if (typeof this.props.onFilterFocus === 'function') {
      this.props.onFilterFocus(event);
    }
  }

  onSelectAll = (event: Tag.Event) => {
    if (typeof this.props.onSelectAll === 'function') {
      this.props.onSelectAll(event, this.state.items.slice(0));
    }
  }

  updateItems(value: string = this.refs.filter.value, items: FilteredList.Item[] = this.props.items) {
    const filtered = items
      .filter((item) => this.filterItem(value, item))
      .map((item, i, allItems) => this.decorateItem(value, item, i, allItems));

    if (filtered.length !== 0 || this.state.items.length !== 0) {
      this.state.items = filtered;
      this.state.inputValue = value;
    }
  }

  filterItem(value: string, item: FilteredList.Item) {
    value = value.trim().toLowerCase();

    if (!item) {
      return false;
    } else if (typeof item === 'string') {
      return item.toLowerCase().includes(value);
    } else if (typeof item.value === 'string') {
      return item.value.toLowerCase().includes(value);
    } else {
      return false;
    }
  }

  decorateItem(value: string, item: FilteredList.Item, index: number, items: FilteredList.Item[]) {
    value = value.trim().toLowerCase();

    if (typeof item === 'object' && typeof item.value === 'string') {
      return item.value.toLowerCase() === value || items.length === 1
        ? { ...item, matchesTerm: true }
        : item;
    } else {
      return item;
    }
  }
}

interface FilteredList extends Tag<FilteredList.Props, FilteredList.State> {}
namespace FilteredList {
  export interface Props extends Tag.Props {
    items?: Item[];
    itemAlias?: string;
    indexAlias?: string;
    paginate?: boolean;
    selectAllLabel?: string;
    enableSelectAll?: boolean;
    onFilterFocus?: (event: FocusEvent) => void;
    onSelectAll?: (event: Tag.Event, items: Item[]) => void;
  }

  export interface State {
    items: Item[];
    inputValue: string;
  }

  export type Item = string | ItemObject;

  export type ItemObject = { value: string, onClick: (e: MouseEvent & Tag.Event) => void };
}

export default FilteredList;
