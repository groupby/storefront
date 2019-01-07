import { Actions, Adapters, Events, Routes, Selectors, Store } from '@storefront/flux-capacitor';
import { Request } from 'groupby-api';
import * as UrlParse from 'url-parse';
import CoreSelectors from '../core/selectors';
import UrlBeautifier from '../core/url-beautifier';
import { WINDOW } from '../core/utils';

namespace UrlUtils {
  export const getBaseUri = (): string  => {
    const win = WINDOW();
    return win.document.baseURI || (win.document.querySelector('base') || win.location).href;
  };

  export const getBasePath = (): string => {
    const basePath = UrlParse(UrlUtils.getBaseUri()).pathname;
    return basePath === WINDOW().location.pathname ? '' : basePath.replace(/\/+$/, '');
  };

  export const searchUrlState = (state: Store.State): UrlBeautifier.SearchUrlState => {
    return {
      query: Selectors.query(state),
      page: Selectors.page(state),
      pageSize: Selectors.pageSize(state),
      refinements: Selectors.selectedRefinements(state).map((refinement) => {
        if (refinement.type === 'Value') {
          return { field: refinement.navigationName, value: refinement.value };
        } else {
          return { field: refinement.navigationName, low: refinement.low, high: refinement.high };
        }
      }),
      sort: Selectors.sort(state),
      collection: Selectors.collection(state),
    };
  };

  export const detailsUrlState = (state: Store.State): UrlBeautifier.DetailsUrlState => {
    const details: Store.Product = <any>CoreSelectors.transformedDetailsProduct(state);
    return {
      data: details.data,
      variants: [],
    };
  };

  export const navigationUrlState = (state: Store.State): any => {
    return {};
  };

  export const pastPurchaseUrlState = (state: Store.State): UrlBeautifier.SearchUrlState => {
    const sorts = Selectors.pastPurchaseSort(state);
    const selected = sorts.selected;

    return {
      query: Selectors.pastPurchaseQuery(state),
      page: Selectors.pastPurchasePage(state),
      pageSize: Selectors.pastPurchasePageSize(state),
      sort: sorts.items[selected],
      refinements: Selectors.pastPurchaseSelectedRefinements(state).map((nav) => {
        if (nav.type === 'Value') {
          return { field: nav.navigationName, value: nav.value };
        }
      }),
      collection: null,
    };
  };

  export const stateToBaseRequest = (state: UrlBeautifier.SearchUrlState, store: Store.State): Partial<Request> => {
    const {
      pageSize,
      query,
      sort,
      page = 1,
      collection = Selectors.collection(store),
      refinements: urlRefinements = [],
      ...rest
    } = state;
    const request: Partial<Request> = rest;

    if (query) {
      request.query = query;
    }

    if (page && pageSize) {
      request.pageSize = Adapters.Request.clampPageSize(page, pageSize);
    }

    if (page && request.pageSize) {
      request.skip = Adapters.Request.extractSkip(page, request.pageSize);
    }

    if (collection) {
      request.collection = collection;
    }

    if (urlRefinements.length) {
      request.refinements = <any>urlRefinements.map((refinement) =>
        Adapters.Request.extractRefinement(refinement.field, <any>refinement)
      );
    }

    if (sort) {
      request.sort = <any>Adapters.Request.extractSort(sort);
    }

    return request;
  };

  export const searchStateToRequest = (state: UrlBeautifier.SearchUrlState, store: Store.State): Partial<Request> => {
    const {
      pageSize = Selectors.pageSize(store),
      query = Selectors.currentQuery(store),
      sort = Selectors.sort(store),
    } = state;

    return stateToBaseRequest({ ...state, pageSize, query, sort }, store);
  };

  export const pastPurchaseStateToRequest = (state: UrlBeautifier.SearchUrlState, store: Store.State): Partial<Request> => {
    const {
      pageSize = Selectors.pastPurchasePageSize(store),
      query = Selectors.pastPurchaseQuery(store),
      // remove `sort` field from parsed URL so that past purchase-specific sort can be applied when SKU data is available.
      sort,
      ...rest
    } = state;

    return stateToBaseRequest({ ...(<UrlBeautifier.SearchUrlState>rest), pageSize, query }, store);
  };

  export const getSortIndex = (stateSort: Store.Sort[], requestSort: Store.Sort) => {
    return stateSort.findIndex((sort) => {
      if (requestSort && sort.field === requestSort.field) {
        return !!sort['descending'] === requestSort.descending;
      }
    });
  };

  // tslint:disable-next-line max-line-length
  export const getNavigations = (state: Store.Indexed<Store.Navigation> | Store.AvailableNavigations, request: UrlBeautifier.SearchUrlState) => {
    return {
      allIds: getAllIds(state, request),
      byId: getById(state, request),
    };
  };

  // tslint:disable-next-line max-line-length
  export const getAllIds = (state: Store.Indexed<Store.Navigation> | Store.AvailableNavigations, { refinements = [] }) => {
    return state.allIds.concat(
      ...refinements.map(({ field }) => field).filter((field) => !state.allIds.includes(field))
    );
  };

  // tslint:disable-next-line max-line-length
  export const getById = (state: Store.Indexed<Store.Navigation> | Store.AvailableNavigations, { refinements = [] }) => {
    const byId = { ...state.byId };

    refinements.forEach((refinement) => {
      const field = refinement.field;
      const transformed =
        'low' in refinement ? { low: refinement['low'], high: refinement['high'] } : { value: refinement['value'] };
      const navigation = byId[field];
      if (navigation) {
        const existingIndex = navigation.refinements
          .findIndex((ref) =>
            Adapters.Search.refinementsMatch(<any>transformed, <any>ref, navigation.range ? 'Range' : 'Value')
          );
        if (existingIndex === -1) {
          navigation.selected.push(navigation.refinements.push(<any>transformed) - 1);
        } else if (!navigation.selected.includes(existingIndex)) {
          navigation.selected.push(existingIndex);
        }
      } else {
        byId[field] = <Store.Navigation>{
          field,
          label: field,
          range: 'low' in refinement,
          refinements: [transformed],
          selected: [0],
        };
      }
    });

    return byId;
  };

  export const mergePastPurchaseState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    const presentState = state.data.present;
    const { collection, refinements, pageSize, ...pastPurchaseData } = request;
    return {
      ...state,
      data: {
        ...state.data,
        present: {
          ...presentState,
          pastPurchases: {
            ...presentState.pastPurchases,
            ...pastPurchaseData,
            page: mergePastPurchasePageState(state, request),
            navigations: mergePastPurchaseNavigationsState(state, request),
            sort: mergePastPurchaseSortsState(state, request),
          },
        },
      },
    };
  };

  export const mergePastPurchasePageState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    const presentState = state.data.present;
    const pageSizeIndex = Selectors.pastPurchasePageSizes(state).items.indexOf(request.pageSize);
    return {
      ...presentState.pastPurchases.page,
      current: request.page || Selectors.pastPurchasePage(state),
      sizes: {
        ...Selectors.pastPurchasePageSizes(state),
        selected: pageSizeIndex === -1 ? Selectors.pastPurchasePageSizeIndex(state) : pageSizeIndex,
      },
    };
  };

  export const mergePastPurchaseNavigationsState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    const navigationsObject = Selectors.pastPurchaseNavigationsObject(state);
    const { allIds, byId } = getNavigations(navigationsObject, request);
    return {
      ...navigationsObject,
      allIds,
      byId,
    };
  };

  export const mergeSearchState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    return {
      ...state,
      data: {
        ...state.data,
        present: {
          ...state.data.present,
          query: mergeSearchQueryState(state, request),
          page: mergeSearchPageState(state, request),
          collections: mergeSearchCollectionsState(state, request),
          sorts: mergeSearchSortsState(state, request),
          navigations: mergeSearchNavigationsState(state, request),
        },
      },
    };
  };

  export const mergeSearchQueryState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => ({
    ...state.data.present.query,
    original: request.query || Selectors.query(state),
  });

  export const mergeSearchPageState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    const pageSizeIndex = Selectors.pageSizes(state).items.indexOf(request.pageSize);
    return {
      ...state.data.present.page,
      current: request.page || Selectors.page(state),
      sizes: {
        ...Selectors.pageSizes(state),
        selected: pageSizeIndex === -1 ? Selectors.pageSizeIndex(state) : pageSizeIndex,
      },
    };
  };

  export const mergeSearchCollectionsState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    return {
      ...Selectors.collections(state),
      selected: request.collection || Selectors.collection(state),
    };
  };

  export const mergePastPurchaseSortsState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    return UrlUtils.mergeSortsState(Selectors.pastPurchaseSort(state), request);
  };

  export const mergeSearchSortsState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    return UrlUtils.mergeSortsState(Selectors.sorts(state), request);
  };

  export const mergeSortsState = (sorts: Store.SelectableList<Store.Sort>, request: UrlBeautifier.SearchUrlState) => {
    const currentSortIndex = getSortIndex(sorts.items, request.sort);

    return {
      ...sorts,
      selected: currentSortIndex === -1 ? sorts.selected : currentSortIndex,
    }
  }

  export const mergeSearchNavigationsState = (state: Store.State, request: UrlBeautifier.SearchUrlState) => {
    const navigationsObject = Selectors.navigationsObject(state);
    const { allIds, byId } = getNavigations(navigationsObject, request);
    return {
      ...navigationsObject,
      allIds,
      byId,
    };
  };
}

export default UrlUtils;
