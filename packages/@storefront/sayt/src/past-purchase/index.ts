import { provide, tag, Events, Selectors, Store, Tag } from '@storefront/core';

@provide('pastPurchaseItem')
@tag('gb-sayt-past-purchase', require('./index.html'))
class PastPurchase {
  state: PastPurchase.State = {
    onClick: () => {
      this.dispatch(this.flux.actions.updatePastPurchaseQuery(this.props.data) as any);
      this.flux.emit('sayt:hide');
    },
    pastPurchases: this.select(Selectors.saytPastPurchases).length,
  };

  init() {
    this.subscribe(Events.SAYT_PAST_PURCHASES_UPDATED, this.updatePastPurchases);
  }

  updatePastPurchases = (pastPurchases: Store.ProductWithMetadata[]) =>
    this.set({
      pastPurchases: pastPurchases.length,
    });
}

interface PastPurchase extends Tag {}
namespace PastPurchase {
  export interface Props {
    data: any;
  }

  export interface State {
    pastPurchases: number;
    onClick(): void;
  }
}

export default PastPurchase;
