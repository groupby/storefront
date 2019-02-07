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

    // todo: The below shouldUpdate conditional assignment should be removed
    // when the `field` prop from breadcrumbs is deprecated due to not being required.
    if (!this.props.selectedNavigation) {
      this.shouldUpdate = () => true;
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
    // todo: When `updateFields()`, `getFields()`, and the `field` prop are deprecated within breadcrumbs,
    // remove the || and the conditions following as they will not be needed anymore.
    const { field } =  this.props.selectedNavigation || this.props;
    const navigation = this.props.selectedNavigation || getNavigation(field);

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
            navigationLabel: navigation.label,
            boolean: navigation.boolean,
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
    selectedNavigation?: Store.Navigation;
  }

  export type NavigationSelector = (field: string) => Store.Navigation;

  export interface State extends Store.Navigation {
    navigationSelector?: NavigationSelector;
    refinements: Store.Refinement[];
    selectedRefinementsUpdated?: string;
  }
}

export default RefinementCrumbs;
