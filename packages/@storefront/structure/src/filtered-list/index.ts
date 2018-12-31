import { tag, Tag } from '@storefront/core';
import PagedList from '../paged-list';

const RETURN_KEY_CODE = 13;

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

  onKeyDown(event) {
    if (event.keyCode !== RETURN_KEY_CODE) {
      return;
    }

    const value = this.refs.filter.value.trim().toLowerCase();
    const foundItem = this.state.items.length === 1
      ? this.state.items[0]
      : this.props.items.find((item) => item && (<FilteredList.ItemObject>item).value && (<FilteredList.ItemObject>item).value.toLowerCase() === value);

    if (foundItem && typeof (<FilteredList.ItemObject>foundItem).onClick === 'function') {
      (<FilteredList.ItemObject>foundItem).onClick(event)
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
    value = value.trim().toLowerCase();
    const filtered = this.props.items.filter((item) => {
      if (!item) {
        return false;
      } else if (typeof item === 'string') {
        return item.toLowerCase().includes(value);
      } else if (typeof item.value === 'string') {
        return item.value.toLowerCase().includes(value);
      } else {
        return false;
      }
    });

    if (filtered.length !== 0 || this.state.items.length !== 0) {
      this.state.items = filtered;
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
