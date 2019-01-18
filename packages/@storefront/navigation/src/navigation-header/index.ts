import { provide, tag, Tag } from '@storefront/core';
import NavigationDisplay from '../navigation-display';

@provide('navigationHeader', (props) => props)
@tag('gb-navigation-header', require('./index.html'), require('./index.css'))
class NavigationHeader {
  props: NavigationHeader.Props = <any>{
    icons: {},
  };

  init() {
    this.setIcon();
  }

  onUpdate() {
    this.setIcon();
  }

  setIcon() {
    this.state = { ...this.state, icon: this.toggleIcon() };
  }

  toggleIcon() {
    const { isActive, icons } = this.props;
    return isActive ? icons.toggleOpen : icons.toggleClosed;
  }
}

interface NavigationHeader extends Tag<NavigationHeader.Props, NavigationHeader.State> {}
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
