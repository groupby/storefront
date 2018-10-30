import { tag, Store, Tag } from '@storefront/core';
import RefinementControls from '../refinement-controls';

@tag('gb-range-refinement-controls', require('./index.html'))
class RangeRefinementControls extends RefinementControls<RangeRefinementControls.Props, RangeRefinementControls.State> {
  tags: {
    rangeSelector: Tag;
  };
  props: RangeRefinementControls.Props = <any>{
    labels: {
      low: 'Min',
      high: 'Max',
      submit: 'Submit',
    },
  };

  get alias() {
    return 'rangeControls';
  }

  init() {
    const refinements: Store.RangeRefinement[] = <any>this.props.navigation.refinements;
    const selected = refinements[this.props.navigation.selected[0]] || {};
    const { min, max } = this.props.navigation;

    this.state = {
      ...this.state,
      min,
      max,
      low: selected['low'] || min,
      high: selected['high'] || max,
    };
  }

  onChange = (event: KeyboardEvent) => {
    const rangeSelector = this.tags['gb-range-selector'];
    this.updateSelected(parseFloat(rangeSelector.refs.low.value), parseFloat(rangeSelector.refs.high.value));
  };

  updateSelected = (low: number, high: number) => this.set({ low, high });
}

interface RangeRefinementControls
  extends RefinementControls<RangeRefinementControls.Props, RangeRefinementControls.State> {}
namespace RangeRefinementControls {
  export interface Props extends RefinementControls.Props {
    labels: {
      low: string;
      high: string;
      submit: string;
    };
  }

  export interface State extends RefinementControls.State {
    min: number;
    max: number;
    low: number;
    high: number;
  }
}

export default RangeRefinementControls;
