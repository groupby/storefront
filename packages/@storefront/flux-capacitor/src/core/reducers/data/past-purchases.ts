import Actions from '../../actions';
import Adapter from '../../adapters/past-purchases';
import Store from '../../store';
import * as navigations from './navigations';
import * as page from './page';
import * as products from './products';

export { DEFAULT_PAGE_SIZE } from './page';

export type Action = Actions.ReceivePastPurchaseSkus
  | Actions.ReceivePastPurchaseProducts
  | Actions.ReceiveMorePastPurchaseProducts
  | Actions.ReceiveMorePastPurchaseRefinements
  | Actions.ReceiveSaytPastPurchases
  | Actions.ReceivePastPurchaseRefinements
  | Actions.UpdatePastPurchaseQuery
  | Actions.SelectPastPurchaseSort
  | Actions.ResetPastPurchaseRefinements
  | Actions.SelectPastPurchaseRefinement
  | Actions.DeselectPastPurchaseRefinement
  | Actions.ResetPastPurchasePage
  | Actions.UpdatePastPurchasePageSize
  | Actions.UpdatePastPurchaseCurrentPage
  | Actions.ReceivePastPurchasePage
  | Actions.ReceivePastPurchaseAllRecordCount
  | Actions.ReceivePastPurchaseCurrentRecordCount
  | Actions.ReceivePastPurchaseTemplate;
export type State = Store.PastPurchase;

export namespace PAST_PURCHASE_SORTS {
  export const DEFAULT = 'Default';
  export const MOST_PURCHASED = 'Most Purchased';
  export const MOST_RECENT = 'Most Recent';
}

export const DEFAULTS: State = <any>{
  defaultSkus: [],
  skus: [],
  saytPastPurchases: [],
  products: [],
  count: {
    currentRecordCount: 0,
    allRecordCount: 0,
  },
  query: '',
  sort: {
    items: [{
      field: PAST_PURCHASE_SORTS.DEFAULT,
      descending: true,
    },
    {
      field: PAST_PURCHASE_SORTS.MOST_RECENT,
      descending: true,
    },
    {
      field: PAST_PURCHASE_SORTS.MOST_PURCHASED,
      descending: true,
    }],
    selected: 0,
  },
  navigations: {
    byId: {},
    allIds: [],
  },
  page: page.DEFAULTS,
  template : {}
};

export default function updatePastPurchases(state: State = DEFAULTS, action: Action): State {
  // tslint:disable max-line-length
  switch (action.type) {
    case Actions.RECEIVE_PAST_PURCHASE_SKUS: return updatePastPurchaseSkus(state, action);
    case Actions.RECEIVE_PAST_PURCHASE_PRODUCTS: return updatePastPurchaseProducts(state, action);
    case Actions.RECEIVE_MORE_PAST_PURCHASE_PRODUCTS: return updateMorePastPurchaseProducts(state, action);
    case Actions.RECEIVE_PAST_PURCHASE_ALL_RECORD_COUNT: return updatePastPurchaseAllRecordCount(state, action);
    case Actions.RECEIVE_PAST_PURCHASE_CURRENT_RECORD_COUNT: return updatePastPurchaseCurrentRecordCount(state, action);
    case Actions.RECEIVE_SAYT_PAST_PURCHASES: return updateSaytPastPurchases(state, action);
    case Actions.UPDATE_PAST_PURCHASE_QUERY: return updatePastPurchaseQuery(state, action);
    case Actions.SELECT_PAST_PURCHASE_SORT: return updatePastPurchaseSortSelected(state, action);
    case Actions.RECEIVE_PAST_PURCHASE_REFINEMENTS: return applyNavigationReducer(state, action, navigations.receiveNavigations);
    case Actions.SELECT_PAST_PURCHASE_REFINEMENT: return applyNavigationReducer(state, action, navigations.selectRefinement);
    case Actions.DESELECT_PAST_PURCHASE_REFINEMENT: return applyNavigationReducer(state, action, navigations.deselectRefinement);
    case Actions.RESET_PAST_PURCHASE_REFINEMENTS: return applyNavigationReducer(state, action, navigations.resetRefinements);
    case Actions.RESET_PAST_PURCHASE_PAGE: return applyPageReducer(state, action, page.resetPage);
    case Actions.UPDATE_PAST_PURCHASE_CURRENT_PAGE: return applyPageReducer(state, action, page.updateCurrent);
    case Actions.UPDATE_PAST_PURCHASE_PAGE_SIZE: return applyPageReducer(state, action, page.updateSize);
    case Actions.RECEIVE_PAST_PURCHASE_PAGE: return applyPageReducer(state, action, page.receivePage);
    case Actions.RECEIVE_PAST_PURCHASE_TEMPLATE: return updatePastPurchaseTemplate(state, action);
    case Actions.RECEIVE_MORE_PAST_PURCHASE_REFINEMENTS: return applyMoreRefinementsReducer(state, action, navigations.receiveMoreRefinements);
    default: return state;
  }
  // tslint:enable max-line-length
}

export const updatePastPurchaseSkus = (state: State, { payload }: Actions.ReceivePastPurchaseSkus) =>
  ({
    ...state,
    defaultSkus: payload,
    skus: Adapter.sortSkusByField(payload, state.sort.items[state.sort.selected].field),
  });

export const updatePastPurchaseProducts = (state: State, { payload }: Actions.ReceivePastPurchaseProducts) =>
  ({
    ...state,
    products: payload,
  });

export const updateMorePastPurchaseProducts = (state: State, action: Actions.ReceiveMorePastPurchaseProducts) =>
  ({
    ...state,
    products: products.updateMoreProducts(state.products, action),
  });

// tslint:disable-next-line max-line-length
export const updatePastPurchaseCurrentRecordCount = (state: State, { payload }: Actions.ReceivePastPurchaseCurrentRecordCount) => ({
  ...state,
  count: {
    ...state.count,
    currentRecordCount: payload,
  }
});

// tslint:disable-next-line max-line-length
export const updatePastPurchaseAllRecordCount = (state: State, { payload }: Actions.ReceivePastPurchaseAllRecordCount) => ({
    ...state,
    count: {
      ...state.count,
      allRecordCount: payload,
    }
  });

export const updateSaytPastPurchases = (state: State, { payload }: Actions.ReceiveSaytPastPurchases) =>
  ({
    ...state,
    saytPastPurchases: payload,
  });

export const applyPageReducer = (state: State, { payload }: Action, reducer: Function) =>
  ({
    ...state,
    page: reducer(state.page, payload),
  });

export const applyNavigationReducer = (state: State, { payload }: Action, reducer: Function) =>
  ({
    ...state,
    navigations: reducer(<Store.AvailableNavigations>{
      ...state.navigations,
      sort: []
    }, payload),
  });

// tslint:disable-next-line max-line-length
export const applyMoreRefinementsReducer = (state: State, { payload }: Actions.ReceiveMorePastPurchaseRefinements, reducer: Function) =>
  ({
    ...state,
    navigations: reducer(state.navigations, payload),
  });

export const updatePastPurchaseQuery = (state: State, { payload }: Actions.UpdatePastPurchaseQuery) =>
  ({
    ...state,
    query: payload
  });

export const updatePastPurchaseSortSelected = (state: State, { payload }: Actions.SelectPastPurchaseSort) => {
  return {
    ...state,
    skus: Adapter.sortSkusByField(state.defaultSkus, state.sort.items[payload].field),
    sort: {
      ...state.sort,
      selected: payload,
    }
  };
};

export const updatePastPurchaseTemplate = (state: State, { payload }: Actions.ReceivePastPurchaseTemplate) =>
  ({
    ...state,
    template: payload
  });
