import * as Core from '@storefront/core';

@Core.provide('refinementPillsCategory')
@Core.tag('gb-refinement-pills-category', require('./index.html'))
class RefinementPillCategory {
  props: RefinementPillCategory.Props = <any>{};

  state: RefinementPillCategory.State = <any>{ refinements: [] };

  init() {
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    const navigation = this.props.navigation;
    const isNavigationValid = navigation && navigation.refinements && navigation.selected;
    /* istanbul ignore next */
    let action: Function = () => null;
    switch (this.props.storeSection) {
      case Core.StoreSections.PAST_PURCHASES:
        action = this.actions.resetPastPurchaseQueryAndSelectRefinement;
        break;
    }

    if (isNavigationValid) {
      navigation.refinements = navigation.refinements.map((value, index) => ({
        ...value,
        selected: navigation.selected.some((i) => i === index),
      }));
    }

    const refinements = isNavigationValid
      ? navigation.refinements.map((refinement: Core.Store.Refinement & { onClick?: () => void }, index) => {
          return {
            ...refinement,
            onClick: () => (refinement.onClick ? refinement.onClick() : action(navigation.field, index)),
          };
        })
      : [];

    this.state = { refinements, navigation };
  }
}

interface RefinementPillCategory extends Core.Tag<RefinementPillCategory.Props, RefinementPillCategory.State> {}
export namespace RefinementPillCategory {
  export interface Props extends Core.Tag.Props {
    navigation: Core.Store.Navigation;
  }

  export interface State {
    navigation: Core.Store.Navigation;
    refinements: Core.Store.Refinement[];
  }
}

export default RefinementPillCategory;
