import { configurable, origin, provide, tag, utils, Events, Selectors, Store, Tag } from '@storefront/core';

@configurable
@provide('didYouMean')
@origin('dym')
@tag('gb-did-you-mean', require('./index.html'))
class DidYouMean {
  state: DidYouMean.State = {
    didYouMeans: [],
  };

  init() {
    this.subscribe(Events.DID_YOU_MEANS_UPDATED, this.updateDidYouMeans);

    this.updateDidYouMeans(this.select(Selectors.didYouMean));
  }

  updateDidYouMeans = (didYouMeans: string[]) =>
    !(didYouMeans.length === 0 && this.state.didYouMeans.length === 0) &&
    this.set({ didYouMeans: utils.mapToSearchActions(didYouMeans, <any>this.actions) });
}

interface DidYouMean extends Tag<any, DidYouMean.State> {}
namespace DidYouMean {
  export interface State {
    didYouMeans: Array<{ value: string; onClick: () => void }>;
  }
}

export default DidYouMean;
