import { configurable, origin, provide, tag, Events, Selectors, Store, Tag } from '@storefront/core';

@configurable
@provide('collections')
@origin('collectionSwitcher')
@tag('gb-collections', require('./index.html'))
class Collections {

  props: Collections.Props = {
    labels: {},
    limitCount: false,
  };
  state: Collections.State = {
    collections: [],
    onSelect: (index) => this.actions.selectCollection(this.state.collections[index].value)
  };

  init() {
    this.updateCollections();
    this.subscribe(Events.COLLECTION_UPDATED, this.updateCollectionTotal);
    this.subscribe(Events.SELECTED_COLLECTION_UPDATED, this.updateCollections);
    this.services.collections.register(this);
  }

  updateCollections = () =>
    this.set({
      collections: this.selectCollections(this.select(Selectors.collections))
    })

  updateCollectionTotal = ({ name, total }: Store.Collection) => {
    const index = this.select(Selectors.collectionIndex, name);
    const collections = this.state.collections.slice();

    collections.splice(index, 1, { ...this.state.collections[index], total: this.getTotal(total) });
    this.set({ collections });
  }

  selectCollections(collections: Store.Indexed.Selectable<Store.Collection>) {
    return collections.allIds.map((collection) => ({
      value: collection,
      label: this.props.labels[collection] || collection,
      selected: collections.selected === collection,
      total: this.getTotal(collections.byId[collection].total)
    }));
  }

  getTotal = (total: number) => this.props.limitCount ? Selectors.getLimitedCountDisplay(total) : total
}

interface Collections extends Tag<Collections.Props, Collections.State> { }
namespace Collections {
  export interface Props extends Tag.Props {
    labels: { [collection: string]: string };
    limitCount: boolean;
  }

  export interface State {
    collections: Option[];
    onSelect(index: number): void;
  }

  export interface Option {
    value: string;
    label: string;
    selected?: boolean;
    total?: number | string;
  }
}

export default Collections;
