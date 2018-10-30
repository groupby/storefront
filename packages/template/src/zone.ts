import { Store, Tag } from '@storefront/core';

abstract class Zone {
  init() {
    this.provide('zone', ({ zone }) => zone);
  }
}

interface Zone extends Tag<Zone.Props> {}
namespace Zone {
  export interface Props extends Tag.Props {
    zone: Store.Zone;
  }
}

export default Zone;
