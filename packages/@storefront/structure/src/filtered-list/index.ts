import { tag, KEYS, Tag } from '@storefront/core';
import PagedList from '../paged-list';

@tag('gb-filtered-list', require('./index.html'))
class FilteredList {
  refs: { filter: HTMLInputElement };
  props: FilteredList.Props = {
    items: [],
    paginate: true,
  };
  state: FilteredList.State = {
    items: [],
  };

  childProps() {
    const { itemAlias, indexAlias } = this.props;
    const props: PagedList.Props = { itemAlias, indexAlias, items: this.state.items };

    if (!this.props.paginate) {
      props.pageSize = props.items.length;
    }

    return props;
  }

  onBeforeMount() {
    this.updateItems('');
  }

  onUpdate() {
    this.updateItems();
  }

  onKeyDown(event: KeyboardEvent & Tag.Event) {
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
    this.updateItems();
    this.set(true);
  }

  onFilterFocus(event: Tag.Event & FocusEvent) {
    if (typeof this.props.onFilterFocus === 'function') {
      this.props.onFilterFocus(event);
    }
  }

  updateItems(value: string = this.refs.filter.value) {
    const filtered = this.props.items
      .filter((item) => this.filterItem(value, item))
      .map((item, i, items) => this.decorateItem(value, item, i, items));

    if (filtered.length !== 0 || this.state.items.length !== 0) {
      this.state.items = filtered;
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
    onFilterFocus?: (event: FocusEvent) => void;
  }

  export interface State {
    items: Item[];
  }

  export type Item = string | ItemObject;

  export type ItemObject = { value: string, onClick: (e: MouseEvent & Tag.Event) => void };
}

export default FilteredList;
