import { tag, Store, Tag } from '@storefront/core';

@tag('gb-refinement-list', require('./index.html'))
class RefinementList {
  props: RefinementList.Props = {
    refinements: [],
    itemProps: {},
  };

  get alias() {
    return 'refinements';
  }

  init() {
    this.provide(this.alias, ({ refinements }) => refinements);
  }

  onMount() {
    console.log('mount: ', this.root);
  }

  onUpdate() {
    console.log('update: ', this.root);
  }
}

interface RefinementList extends Tag<RefinementList.Props> {}
namespace RefinementList {
  export interface Props {
    refinements: Refinement[];
    itemProps?: object;
  }

  export type Refinement = Store.Refinement & { selected: boolean };
}

export default RefinementList;
