import { provide, tag, Tag } from '@storefront/core';
import NavigationDisplay from '../navigation-display';

@provide('navigationHeader', (props) => props)
@tag('gb-navigation-header', require('./index.html'), require('./index.css'))
class NavigationHeader {
  props: NavigationHeader.Props = <any>{
    icons: {},
  };

  init() {
    this.setIcon(this.toggleIcon());
  }

  onUpdate() {
    this.setIcon(this.toggleIcon());
  }

  setIcon(icon: string) {
    this.state = { icon };
  }

  toggleIcon() {
    const { isActive, icons } = this.props;
    return isActive ? icons.toggleOpen : icons.toggleClosed;
  }
}

interface NavigationHeader extends Tag<NavigationHeader.Props> {}
namespace NavigationHeader {
  export interface Props extends Tag.Props {
    icons: NavigationDisplay.Icons;
    label: string;
    isActive: boolean;
    collapse: boolean;
    onToggle: () => void;
  }

  export interface State {
    icon: string;
  }
}

export default NavigationHeader;
