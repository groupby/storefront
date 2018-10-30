import { tag, Tag } from '@storefront/core';

@tag('gb-range-selector', require('./index.html'), require('./index.css'))
class RangeSelector {
  onClick = () => {
    if (!isNaN(this.props.values.high) && !isNaN(this.props.values.low)) {
      if (this.props.values.low > this.props.values.high) {
        this.actions.switchRefinement(
          this.props.field,
          Math.min(this.props.values.high, this.props.values.max),
          Math.max(this.props.values.low, this.props.values.min)
        );
      } else {
        this.actions.switchRefinement(
          this.props.field,
          Math.max(this.props.values.low, this.props.values.min),
          Math.min(this.props.values.high, this.props.values.max)
        );
      }
    }
  };
}

interface RangeSelector extends Tag {}
namespace RangeSelector {
  export interface Props extends Tag.Props {
    labels: {
      low: string;
      high: string;
      submit: string;
    };
    values: {
      low: number;
      high: number;
      min: number;
      max: number;
    };
    field: string;
    onChange: () => void;
  }
}

export default RangeSelector;
