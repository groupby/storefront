import { provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@provide('refinementCrumbs')
@tag('gb-refinement-crumbs', require('./index.html'))
class RefinementCrumbs {
  previousField: string;

  init() {
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.state.selectedRefinementsUpdated = Events.PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED;
        this.state.navigationSelector = (field) => this.select(Selectors.pastPurchaseNavigation, field);
        break;
      case StoreSections.SEARCH:
        this.state.selectedRefinementsUpdated = Events.SELECTED_REFINEMENTS_UPDATED;
        this.state.navigationSelector = (field) => this.select(Selectors.navigation, field);
        break;
    }

    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  onUnmount() {
    this.flux.off(`${this.state.selectedRefinementsUpdated}:${this.previousField}`, this.updateRefinements);
  }

  updateState() {
    if (this.props.field !== this.previousField) {
      this.flux.off(`${this.state.selectedRefinementsUpdated}:${this.previousField}`, this.updateRefinements);
      this.flux.on(`${this.state.selectedRefinementsUpdated}:${this.props.field}`, this.updateRefinements);
      this.previousField = this.props.field;
    }

    this.state = { ...this.state, ...this.selectRefinements(this.state.navigationSelector) };
  }

  updateRefinements = () => this.set(this.selectRefinements(this.state.navigationSelector));

  selectRefinements(getNavigation: RefinementCrumbs.NavigationSelector) {
    const { field } = this.props;
    const navigation = getNavigation(field);

    if (navigation) {
      const { range, refinements, selected } = navigation;

      return {
        ...navigation,
        field,
        refinements: refinements
          .map((refinement, index) => ({
            ...refinement,
            index,
            field,
            range,
            selected: selected.includes(index),
          }))
          .filter((refinement) => refinement.selected),
      };
    }
  }
}

interface RefinementCrumbs extends Tag<RefinementCrumbs.Props, RefinementCrumbs.State> {}
namespace RefinementCrumbs {
  export interface Props extends Tag.Props {
    field: string;
  }

  export type NavigationSelector = (field: string) => Store.Navigation;

  export interface State extends Store.Navigation {
    navigationSelector?: NavigationSelector;
    refinements: Store.Refinement[];
    selectedRefinementsUpdated?: string;
  }
}

export default RefinementCrumbs;
