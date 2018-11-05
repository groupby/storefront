import { Events, Selectors, Store, Tag } from '@storefront/core';

abstract class RefinementControls<P extends RefinementControls.Props, S extends RefinementControls.State> {
  abstract get alias(): string;

  init() {
    this.provide(this.alias);
    this.updateState();
  }

  onUpdate() {
    this.updateState();
  }

  updateState() {
    this.state = { ...(this.state as any), ...this.transformNavigation(this.props.navigation) };
  }

  transformNavigation<T extends RefinementControls.SelectedNavigation>(
    navigation: RefinementControls.SelectedNavigation
  ): T {
    return <any>navigation;
  }
}

interface RefinementControls<
  P extends RefinementControls.Props = RefinementControls.Props,
  S extends RefinementControls.State = RefinementControls.State
> extends Tag<P, S> {}
namespace RefinementControls {
  export interface Props extends Tag.Props {
    navigation: SelectedNavigation;
  }

  export interface State extends SelectedNavigation {}

  export interface SelectedNavigation extends Partial<Store.Navigation> {
    refinements?: SelectedRefinement[];
  }

  export type SelectedRefinement = Store.Refinement & {
    selected: boolean;
    or: boolean;
    range: boolean;
    index: number;
  };
}

export default RefinementControls;
