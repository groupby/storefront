import Actions from '../../actions';
import SearchAdapter from '../../adapters/search';
import Store from '../../store';

export type Action = Actions.ReceiveProductRecords | Actions.ReceiveMoreProducts;
export type State = Store.ProductWithMetadata[];

export default function updateProducts(state: State = [], action: Action): State {
  switch (action.type) {
    case Actions.RECEIVE_PRODUCT_RECORDS: return update(state, action);
    case Actions.RECEIVE_MORE_PRODUCTS: return updateMoreProducts(state, action);
    default: return state;
  }
}

export function update(_: State, { payload: products }: Actions.ReceiveProductRecords) {
  return SearchAdapter.isResult(products) ? SearchAdapter.augmentProducts(products) : products;
}

// tslint:disable-next-line max-line-length
export function updateMoreProducts(state: State, { payload: products }: Actions.ReceiveMoreProducts | Actions.ReceiveMorePastPurchaseProducts) {
  if (!products.length) {
    return state;
  } else if (!state.length) {
    return products;
  } else if (state[0].index > products[products.length - 1].index) {
    return [...products, ...state];
  } else if (state[state.length - 1].index < products[0].index) {
    return [...state, ...products];
  } else {
    return state;
  }
}
