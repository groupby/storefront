import { configurable, origin, provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';
import NavigationDisplay from '../navigation-display';
import NavigationList from '../navigation-list';

@configurable
@provide('navigation')
@origin('navigation')
@tag('gb-navigation', require('./index.html'))
class Navigation {
  props: Navigation.Props = {
    alwaysShowTotals: false,
    display: {},
    labels: {},
    collapse: true,
    showOnlyAvailableNavHeaders: false,
  };
  state: Navigation.State = {
    fields: [],
  };

  init() {
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.state.availableNavigationSelector = () => this.select(Selectors.availablePastPurchaseNavigations);
        this.subscribe(Events.PAST_PURCHASE_NAVIGATIONS_UPDATED, this.updateFields);
        this.updateFields(this.select(Selectors.pastPurchaseNavigationsObject));
        break;
      case StoreSections.SEARCH:
        this.state.availableNavigationSelector = () => this.select(Selectors.availableNavigations);
        this.subscribe(Events.NAVIGATIONS_UPDATED, this.updateFields);
        this.updateFields(this.select(Selectors.navigationsObject));
        break;
    }
  }

  updateFields = (navigations: Store.Indexed<Store.Navigation>) => {
    const { collapse } = this.props;
    let isActive: boolean | number = true;
    if (typeof collapse !== 'boolean') {
      isActive = collapse.isActive;
    }
    const navs = this.props.showOnlyAvailableNavHeaders
      ? this.state.availableNavigationSelector().map((nav) => nav.field)
      : navigations.allIds;

    this.set({
      fields: navs.map((value, index) => ({
        value,
        display: this.props.display[value],
        label: this.props.labels[value],
        active: typeof isActive === 'boolean' ? isActive : index < isActive,
        alwaysShowTotals: this.props.alwaysShowTotals,
      })),
    });
  };
}

interface Navigation extends Tag<Navigation.Props, Navigation.State> {}
namespace Navigation {
  export interface Props extends Tag.Props {
    alwaysShowTotals: boolean;
    display: NavigationList.DisplayMap;
    labels: { [key: string]: string };
    collapse:
      | boolean
      | {
          isActive: boolean | number;
        };
    showOnlyAvailableNavHeaders: boolean;
  }

  export interface State {
    fields: NavigationDisplay.Field[];
    availableNavigationSelector?: () => Store.Navigation[];
  }
}

export default Navigation;
