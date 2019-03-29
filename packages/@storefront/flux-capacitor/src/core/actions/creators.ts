import { Results } from 'groupby-api';
import Actions from '.';
import PageAdapter from '../adapters/page';
import SearchAdapter from '../adapters/search';
import Configuration from '../configuration';
import Selectors from '../selectors';
import Store from '../store';
import { StoreSections } from '../utils';
import { createAction, handleError, refinementPayload, shouldResetRefinements } from './utils';
import * as validators from './validators';

namespace ActionCreators {
  /**
   * Updates state with given state.
   * @param state - The state to use.
   * @return - Action with state.
   */
  export function refreshState(state: any): Actions.RefreshState {
    return createAction(Actions.REFRESH_STATE, state);
  }

  /**
   * Updates the history state.
   * @param urlState - The history state to use.
   * @return - Action with state.
   */
  export function updateHistory(urlState: Actions.Payload.History.State): Actions.UpdateHistory {
    return createAction(Actions.UPDATE_HISTORY, urlState);
  }

  // fetch action creators
  /**
   * Makes a request for more refinements for given navigation.
   * @param options - An object with the navigationId for
   * the navigation to fetch more refinements against and a request object for override.
   * @return - Action with `{ navigationId, request }`.
   */
  export function fetchMoreRefinements(options: Actions.Payload.Fetch.MoreRefinements): Actions.FetchMoreRefinements;
  /**
   * Makes a request for more refinements for given navigation.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @return - Action with `{ navigationId }`.
   */
  export function fetchMoreRefinements(navigationId: string): Actions.FetchMoreRefinements;
  // tslint:disable-next-line typedef
  export function fetchMoreRefinements(options) {
    const opts = typeof options === 'string' ? { navigationId: options } : options;

    return createAction(Actions.FETCH_MORE_REFINEMENTS, opts);
  }

  /**
   * Makes a request for products.
   * @param options - An object with a request object for override.
   * @return - Action with `{ request }`.
   */
  export function fetchProducts(options: Actions.Payload.Fetch.Override = {}): Actions.FetchProducts {
    // console.time('FETCH_PRODUCTS_SAGA');
    // console.time('FETCH_PRODUCTS');
    return createAction(Actions.FETCH_PRODUCTS, options);
  }

  /**
   * Makes a request for products without history being set afterwards.
   * @param options - An object with a request object for override.
   * @return - Action with `{ request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchProductsWithoutHistory(options: Actions.Payload.Fetch.Override = {}): Actions.FetchProductsWithoutHistory {
    return createAction(Actions.FETCH_PRODUCTS_WITHOUT_HISTORY, options);
  }

  /**
   * Wrapper for fetchProducts, dispatches it within saga when store is rehydrated
   * @param options - An object with a request object for override.
   * @return - Action with `{ request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchProductsWhenHydrated(options: Actions.Payload.Fetch.Override = {}): Actions.FetchProductsWhenHydrated {
    return createAction(Actions.FETCH_PRODUCTS_WHEN_HYDRATED, ActionCreators.fetchProducts(options));
  }

  /**
   * Makes a request for additional products beyond currently requested products.
   * @param options - An object with the
   * amount and forward values, and a request object for override
   * @return - Action with `{ amount, forward, request }`.
   */
  export function fetchMoreProducts(options: Actions.Payload.Fetch.MoreProducts);
  /**
   * Makes a request for additional products beyond currently requested products.
   * @param amount - Amount of more products to fetch.
   * @param forward - `true` to fetch forward
   * @return - Action with `{ amount, forward }`.
   */
  export function fetchMoreProducts(amount: number, forward?: boolean);
  // tslint:disable-next-line typedef
  export function fetchMoreProducts(options, forward = true) {
    const validator = {
      forward: validators.isNotFetching,
    };
    const opts = typeof options === 'number' ? { amount: options, forward } : { forward, ...options };

    return createAction(Actions.FETCH_MORE_PRODUCTS, opts, validator);
  }

  /**
   * Makes a request for autocomplete suggestions.
   * @param options - An object
   * with the query term to fetch autocomplete suggestions against, and a request object for override.
   * @return - Action with `{ query, request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchAutocompleteSuggestions(options: Actions.Payload.Fetch.AutocompleteSuggestions): Actions.FetchAutocompleteSuggestions;
  /**
   * Makes a request for autocomplete suggestions.
   * @param query - Search term to fetch autocomplete suggestions against.
   * @return - Action with `{ query }`.
   */
  export function fetchAutocompleteSuggestions(query: string): Actions.FetchAutocompleteSuggestions;
  // tslint:disable-next-line typedef
  export function fetchAutocompleteSuggestions(options): Actions.FetchAutocompleteSuggestions {
    const validator = {
      query: validators.isString,
    };
    const opts = typeof options === 'string' ? { query: options } : options;

    return createAction(Actions.FETCH_AUTOCOMPLETE_SUGGESTIONS, opts, validator);
  }

  /**
   * Makes a request for autocomplete products.
   * @param options - An object
   * with the query and refinements, and a request object for override.
   * @return - Action with `{ query, refinements, request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchAutocompleteProducts(options: Actions.Payload.Fetch.AutocompleteProducts): Actions.FetchAutocompleteProducts;
  /**
   * Makes a request for autocomplete products.
   * @param query - Search term
   * to fetch autocomplete products against.
   * @param refinements - The applied
   * refinements.
   * @return - Action with `{ query, refinements }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchAutocompleteProducts(query: string, refinements?: Actions.Payload.Autocomplete.Refinement[]): Actions.FetchAutocompleteProducts;
  // tslint:disable-next-line typedef
  export function fetchAutocompleteProducts(options, refinements = []): Actions.FetchAutocompleteProducts {
    const validator = {
      query: validators.isValidQuery,
    };
    const opts = typeof options === 'string' || options === null
      ? { query: options, refinements }
      : { refinements, ...options };

    return createAction(Actions.FETCH_AUTOCOMPLETE_PRODUCTS, opts, validator);
  }

  /**
   * Makes a request for the collection count for a given collection.
   * @param options - An object with the collection name,
   * and a request object for override.
   * @return - Action with `{ collection, request }`.
   */
  export function fetchCollectionCount(options: Actions.Payload.Fetch.CollectionCount): Actions.FetchCollectionCount;
  /**
   * Makes a request for the collection count for a given collection.
   * @param collection - Collection name.
   * @return - Action with `{ collection }`.
   */
  export function fetchCollectionCount(collection: string): Actions.FetchCollectionCount;
  // tslint:disable-next-line typedef
  export function fetchCollectionCount(options): Actions.FetchCollectionCount {
    const opts = typeof options === 'string' ? { collection: options } : options;

    return createAction(Actions.FETCH_COLLECTION_COUNT, opts);
  }

  /**
   * Makes a request for the details for a given product.
   * @param options - An object with the id for a specific product,
   * and a request object for override.
   * @return - Action with `{ id, request }`.
   */
  export function fetchProductDetails(options: Actions.Payload.Fetch.Details): Actions.FetchProductDetails;
  /**
   * Makes a request for the details for a given product.
   * @param id - The id for a specific product.
   * @param redirect - Indicates whether fetch is a result of a single product redirect.
   * @return - Action with `{ id }`.
   */
  export function fetchProductDetails(id: string, redirect?: boolean): Actions.FetchProductDetails;
  // tslint:disable-next-line typedef
  export function fetchProductDetails(options, redirect = false): Actions.FetchProductDetails {
    const opts = typeof options === 'string'
      ? { id: options, buildAndParse: redirect }
      : { ...options, buildAndParse: redirect };

    return createAction(Actions.FETCH_PRODUCT_DETAILS, opts);
  }

  /**
   * Makes a request for recommendations products.
   * @param options - An object with a
   * request object for override.
   * @return - Action with `{ request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchRecommendationsProducts(options: Actions.Payload.Fetch.Override = {}): Actions.FetchRecommendationsProducts {
    return createAction(Actions.FETCH_RECOMMENDATIONS_PRODUCTS, options);
  }

  /**
   * Makes a request for past purchases.
   * @param options - An object with a query string,
   * and a request object for override.
   * @return - Action with `{ query, request }`.
   */
  export function fetchPastPurchases(options?: Actions.Payload.Fetch.PastPurchases): Actions.FetchPastPurchases;
  /**
   * Makes a request for past purchases.
   * @param query - A search term
   * @return - Action with `{ query }`.
   */
  export function fetchPastPurchases(query: string): Actions.FetchPastPurchases;
  // tslint:disable-next-line typedef
  export function fetchPastPurchases(options = {}): Actions.FetchPastPurchases {
    const opts = typeof options === 'string' ? { query: options } : options;

    return createAction(Actions.FETCH_PAST_PURCHASES, opts);
  }

  /**
   * Makes a request for past purchase products.
   * @param options - An object with a request object for override.
   * @return - Action with `{ query, request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchPastPurchaseProducts(options: Actions.Payload.Fetch.PastPurchases = {}): Actions.FetchPastPurchaseProducts {
    return createAction(Actions.FETCH_PAST_PURCHASE_PRODUCTS, options);
  }

  /**
   * Makes a request for more past purchase products.
   * @param options - An object with amount number, forward boolean,
   * and a request object for override.
   * @return - Action with `{ amount, forward, request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchMorePastPurchaseProducts(options: Actions.Payload.Fetch.MorePastPurchases): Actions.FetchMorePastPurchaseProducts;
  /**
   * Makes a request for more past purchase products.
   * @param amount - The amount of additional products to fetch.
   * @param forward - Whether to fetch the next page or previous page.
   * and a request object for override.
   * @return - Action with `{ amount, forward }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchMorePastPurchaseProducts(amount: number, forward?: boolean): Actions.FetchMorePastPurchaseProducts;
  // tslint:disable-next-line typedef
  export function fetchMorePastPurchaseProducts(options, forward = true): Actions.FetchMorePastPurchaseProducts {
    const opts = typeof options === 'number' ? { amount: options, forward } : { forward, ...options };

    return createAction(Actions.FETCH_MORE_PAST_PURCHASE_PRODUCTS, opts);
  }

  /**
   * Makes a request for more past purchase refinements for given navigation.
   * @param options - An object with the navigationId for
   * the navigation to fetch more refinements against and a request object for override.
   * @return - Action with `{ navigationId, request }`.
   */
  // tslint:disable-next-line max-line-length
  export function fetchMorePastPurchaseRefinements(options: Actions.Payload.Fetch.MorePastPurchaseRefinements): Actions.FetchMorePastPurchaseRefinements;
  /**
   * Makes a request for more past purchase refinements for given navigation.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @return - Action with `{ navigationId }`.
   */
  export function fetchMorePastPurchaseRefinements(navigationId: string): Actions.FetchMorePastPurchaseRefinements;
  // tslint:disable-next-line typedef
  export function fetchMorePastPurchaseRefinements(options) {
    const opts = typeof options === 'string' ? { navigationId: options } : options;

    return createAction(Actions.FETCH_MORE_PAST_PURCHASE_REFINEMENTS, opts);
  }

  /**
   * Makes a request for sayt past purchases.
   * @param options - An object with a query string,
   * and a request object for override.
   * @return - Action with `{ query, request }`.
   */
  export function fetchSaytPastPurchases(options: Actions.Payload.Fetch.PastPurchases): Actions.FetchSaytPastPurchases;
  /**
   * Makes a request for sayt past purchases.
   * @param query - A search term.
   * @return - Action with `{ query }`.
   */
  export function fetchSaytPastPurchases(query: string): Actions.FetchSaytPastPurchases;
  // tslint:disable-next-line typedef
  export function fetchSaytPastPurchases(options): Actions.FetchSaytPastPurchases {
    const opts = typeof options === 'string' ? { query: options } : options;

    return createAction(Actions.FETCH_SAYT_PAST_PURCHASES, opts);
  }

  // request action creators
  /**
   * Updates the search with given parameters.
   * @param newSearch - Search object for requested search.
   * @return - Actions with relevant data.
   */
  export function updateSearch(newSearch: Actions.Payload.Search) {
    return (state: Store.State): Actions.UpdateSearch => {
      const searchActions: Actions.UpdateSearch = [ActionCreators.resetPage()];

      if ('query' in newSearch) {
        searchActions.push(...ActionCreators.updateQuery(newSearch.query));
      }
      if ('clear' in newSearch && shouldResetRefinements(newSearch, state)) {
        searchActions.push(...ActionCreators.resetRefinements(newSearch.clear));
      }
      if ('navigationId' in newSearch) {
        if ('index' in newSearch) {
          searchActions.push(...ActionCreators.selectRefinement(newSearch.navigationId, newSearch.index));
        } else if (newSearch.range) {
          searchActions.push(...ActionCreators.addRefinement(newSearch.navigationId, newSearch.low, newSearch.high));
        } else if ('value' in newSearch) {
          searchActions.push(...ActionCreators.addRefinement(newSearch.navigationId, newSearch.value));
        }
      }

      return searchActions;
    };
  }

  /**
   * Updates the search query.
   * @param query - Search term to use.
   * @return - Actions with relevant data.
   */
  export function updateQuery(query: string): Actions.ResetPageAndUpdateQuery {
    return [
      ActionCreators.resetPage(),
      createAction(Actions.UPDATE_QUERY, query && query.trim(), {
        payload: validators.isValidQuery,
      })
    ];
  }

  /**
   * Clears the query.
   * @return - Actions with relevant data.
   */
  export function resetQuery(): Actions.ResetPageAndUpdateQuery {
    return ActionCreators.updateQuery(null);
  }

  /**
   * Adds a given refinement to the search.
   * @param field - The field name for the refinement.
   * @param valueOrLow - Either the value for a value refinement, or the low for a range refinement.
   * @param high - Either the high for a range refinement, or left out for a value refinement.
   * @return - Actions with relevant data.
   */
  // tslint:disable-next-line max-line-length
  export function addRefinement(field: string, valueOrLow: any, high: any = null): Actions.ResetPageAndAddRefinement {
    return [
      ActionCreators.resetPage(),
      createAction(Actions.ADD_REFINEMENT, refinementPayload(field, valueOrLow, high), {
        navigationId: validators.isString,
        payload: [
          validators.isRangeRefinement,
          validators.isValidRange,
          validators.isValueRefinement,
          validators.isNotFullRange,
          validators.isRefinementDeselectedByValue
        ]
      })
    ];
  }

  /**
   * Removes all refinements for a given navigation field and adds the given
   * refinement to the search.
   * @param field - The field name for the navigation.
   * @param valueOrLow - Either the value for a value refinement, or the low for a range refinement.
   * @param high - Either the high for a range refinement, or left out for a value refinement.
   * @return - Actions with relevant data.
   */
  export function switchRefinement(field: string, valueOrLow: any, high: any = null): Actions.SwitchRefinement {
    return <any>[
      ActionCreators.resetPage(),
      ...ActionCreators.resetRefinements(field),
      ...ActionCreators.addRefinement(field, valueOrLow, high)
    ];
  }

  /**
   * Removes the selected refinements from the search.
   * @param field - true to reset all refinements,
   * or navigationId to reset all refinements on a specific navigation.
   * @return - Actions with relevant data.
   */
  export function resetRefinements(field: boolean | string): Actions.ResetPageAndResetRefinements {
    return [
      ActionCreators.resetPage(),
      createAction(Actions.RESET_REFINEMENTS, field, {
        payload: [
          validators.isValidClearField,
          validators.hasSelectedRefinements,
          validators.hasSelectedRefinementsByField
        ]
      })
    ];
  }

  /**
   * Sets the current page in the store to page 1, but does not update the search.
   * @return - Action with undefined.
   */
  export function resetPage(): Actions.ResetPage {
    return createAction(Actions.RESET_PAGE, undefined, {
      payload: validators.notOnFirstPage
    });
  }

  /**
   * Performs search with query, removes current refinements.
   * @param query - Search term to perform search with. If not supplied,
   * search with current query is performed, removing current refinements.
   * @return - Actions with relevant data.
   */
  export function search(query?: string) {
    return (state: Store.State): Actions.Search => {
      const actions: any = [ActionCreators.resetPage()];
      if (Selectors.config(state).search.useDefaultCollection) {
        actions.push(ActionCreators.selectCollection(Selectors.defaultCollection(state)));
      }
      // tslint:disable-next-line max-line-length
      actions.push(...ActionCreators.resetRefinements(true), ...ActionCreators.updateQuery(query || Selectors.query(state)));

      return actions;
    };
  }

  /**
   * Performs a new search with query or selected refinement, and resets recallId.
   * @param query - The query to use in the search.
   * @param field - The navigation for the refinement to select.
   * @param index - The index for the refinement.
   * @return - Actions with relevant data.
   */
  // tslint:disable-next-line max-line-length
  export function resetRecall(query: string = null, { field, index }: { field: string, index: number } = <any>{}) {
    return (state: Store.State): Actions.ResetRecall => {
      const resetActions: any[] = ActionCreators.search(query)(state);
      if (field) {
        resetActions.push(...ActionCreators.selectRefinement(field, index));
      }

      return <Actions.ResetRecall>resetActions;
    };
  }

  /**
   * Selects a given refinement based on navigationId and index.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @param index - The index of the refinement intended to be selected.
   * @return - Actions with relevant data.
   */
  export function selectRefinement(navigationId: string, index: number): Actions.ResetPageAndSelectRefinement {
    return [
      ActionCreators.resetPage(),
      createAction(Actions.SELECT_REFINEMENT, { navigationId, index }, {
        payload: validators.isRefinementDeselectedByIndex
      })
    ];
  }

  /**
   * Selects the given refinements based on navigationId and indices.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @param indices - The indices of the refinements intended to be selected.
   * @return - Actions with relevant data.
   */
  // tslint:disable-next-line max-line-length
  export function selectMultipleRefinements(navigationId: string, indices: number[]): Actions.ResetPageAndSelectMultipleRefinements {
    return [
      ActionCreators.resetPage(),
      createAction(Actions.SELECT_MULTIPLE_REFINEMENTS, { navigationId, indices }, {
        payload: validators.areMultipleRefinementsDeselectedByIndex
      }),
    ];
  }

  /**
   * Removes a given refinement based on navigationId and index.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @param index - The index of the refinement intended to be selected.
   * @return - Actions with relevant data.
   */
  export function deselectRefinement(navigationId: string, index: number): Actions.ResetPageAndDeselectRefinement {
    return [
      ActionCreators.resetPage(),
      createAction(Actions.DESELECT_REFINEMENT, { navigationId, index }, {
        payload: validators.isRefinementSelectedByIndex
      })
    ];
  }

  /**
   * Selects a given collection based on id.
   * @param id - The id of the selected collection.
   * @return - Action with id.
   */
  export function selectCollection(id: string): Actions.SelectCollection {
    return createAction(Actions.SELECT_COLLECTION, id, {
      payload: validators.isCollectionDeselected
    });
  }

  /**
   * Selects a given sort based on index.
   * @param index - The index of the selected sort.
   * @return - Action with index.
   */
  export function selectSort(index: number): Actions.SelectSort {
    return createAction(Actions.SELECT_SORT, index, {
      payload: validators.isSortValid,
    });
  }

  /**
   * Updates the sorts using the data provided.
   * @param payload - An object containing the sort labels and options.
   * @return - Action with payload.
   */
  export function applySorts(payload: Actions.Payload.Sort): Actions.ApplySorts {
    return createAction(Actions.APPLY_SORTS, payload, {
      payload: [
        validators.hasValidLabels,
        validators.hasValidOptions,
        validators.hasValidSelected,
      ],
    });
  }

  /**
   * Updates the page size to given size.
   * @param size - The size the page is updated to. Must correspond to a size in the pageSize in the store.
   * @return - Action with size.
   */
  export function updatePageSize(size: number): Actions.UpdatePageSize {
    return createAction(Actions.UPDATE_PAGE_SIZE, size, {
      payload: validators.isDifferentPageSize
    });
  }

  /**
   * Updates the current page to the given page.
   * @param page - The page to switch to.
   * @return - Action with page.
   */
  export function updateCurrentPage(page: number): Actions.UpdateCurrentPage {
    return createAction(Actions.UPDATE_CURRENT_PAGE, page, {
      payload: [
        validators.isValidPage,
        validators.isOnDifferentPage
      ]
    });
  }

  /**
   * Updates the details product in the store.
   * @param details - The product to use as the details product.
   * @return - Action with details.
   */
  export function updateDetails(details: Store.Details): Actions.UpdateDetails {
    return createAction(Actions.UPDATE_DETAILS, details);
  }

  /**
   * Updates the autocomplete query with the given term.
   * @param query - The search term to update the autocomplete query to and get suggestions based on.
   * @return - Action with query.
   */
  export function updateAutocompleteQuery(query: string): Actions.UpdateAutocompleteQuery {
    return createAction(Actions.UPDATE_AUTOCOMPLETE_QUERY, query, {
      payload: validators.isDifferentAutocompleteQuery
    });
  }

  /**
   * The biasing object to receive and update biasing with
   * @param payload - Biasing object
   * @return - Action with biasing object.
   */
  export function updateBiasing(payload: Actions.Payload.Personalization.Biasing) {
    return (state: Store.State): Actions.UpdateBiasing =>
      createAction(Actions.UPDATE_BIASING, {
        ...payload,
        config: Selectors.config(state).personalization.realTimeBiasing,
      }, {
          payload: validators.isValidBias
        });
  }

  export function updateSecuredPayload(payload: Configuration.Recommendations.SecuredPayload) {
    return createAction(Actions.UPDATE_SECURED_PAYLOAD, payload);
  }

  /**
   * The fetch state of infinite scroll request.
   * @param fetchObj - Whether is fetching forward or backward.
   * @return - Action with fetching state object.
   */
  export function infiniteScrollRequestState(fetchObj: Actions.Payload.InfiniteScroll): Actions.ReceiveInfiniteScroll {
    return createAction(Actions.RECEIVE_INFINITE_SCROLL, fetchObj);
  }

  // response action creators
  /**
   * The query object to receive and update state with.
   * @param query - Query object.
   * @return - Action with query object.
   */
  export function receiveQuery(query: Actions.Payload.Query): Actions.ReceiveQuery {
    return createAction(Actions.RECEIVE_QUERY, query);
  }

  /**
   * The response to receive and update state with.
   * @param res - Response object, as returned by the request.
   * @return - Actions with relevant data.
   */
  export function receiveProducts(res: Results) {
    return (state: Store.State): Actions.Action<string, any>[] | Actions.ReceiveProducts => {
      const receiveProductsAction = createAction(Actions.RECEIVE_PRODUCTS, res);
      console.time('RECEIVE_PRODUCTS');
      // console.timeEnd('FETCH_PRODUCTS');

      return handleError(receiveProductsAction, () => {
        const limitedRecordCount = SearchAdapter.extractRecordCount(res.totalRecordCount);

        return [
          receiveProductsAction,
          ActionCreators.receiveSiteParams(res.siteParams),
          ActionCreators.receiveQuery(SearchAdapter.extractQuery(res)),
          ActionCreators.receiveProductRecords(SearchAdapter.augmentProducts(res)),
          ActionCreators.receiveNavigations(
            SearchAdapter.pruneRefinements(SearchAdapter.combineNavigations(res), StoreSections.SEARCH, state)),
          ActionCreators.receiveRecordCount(res.totalRecordCount),
          ActionCreators.receiveCollectionCount({
            collection: Selectors.collection(state),
            count: res.totalRecordCount
          }),
          ActionCreators.receivePage(
            limitedRecordCount,
            PageAdapter.currentPage(res.originalRequest.skip, res.originalRequest.pageSize)
          )(state),
          ActionCreators.receiveTemplate(SearchAdapter.extractTemplate(res.template)),
        ];
      });
    };
  }

  /**
   * The products to receive and update the state with.
   * @param products - Products that will be received and updated to in the state.
   * @return - Action with products.
   */
  export function receiveProductRecords(products: Store.ProductWithMetadata[]): Actions.ReceiveProductRecords {
    return createAction(Actions.RECEIVE_PRODUCT_RECORDS, products);
  }

  /**
   * The collection count to receive and update the state with.
   * @param count - The count to update the collection count to.
   * @return - Action with count.
   */
  export function receiveCollectionCount(count: Actions.Payload.Collection.Count): Actions.ReceiveCollectionCount {
    return createAction(Actions.RECEIVE_COLLECTION_COUNT, count);
  }

  /**
   * The navigations to receive and update state with.
   * @param navigations - The navigations that state will update to.
   * @return - Action with navigations.
   */
  export function receiveNavigations(navigations: Store.Navigation[]): Actions.ReceiveNavigations {
    return createAction(Actions.RECEIVE_NAVIGATIONS, navigations);
  }

  /**
   * The page to receive and update state with.
   * @param page - The page object state will update to.
   * @return - Action with page.
   */
  export function receivePage(recordCount: number, current?: number) {
    return (state: Store.State): Actions.ReceivePage => {
      return createAction(Actions.RECEIVE_PAGE, SearchAdapter.extractPage(state, recordCount, current));
    };
  }

  /**
   * The template to receive and update state with.
   * @param template - The template state will update to.
   * @return - Action with template.
   */
  export function receiveTemplate(template: Store.Template): Actions.ReceiveTemplate {
    return createAction(Actions.RECEIVE_TEMPLATE, template);
  }

  /**
   * The record count to receive and update state with.
   * @param recordCount - The record count state will update to.
   * @return - Action with recordCount.
   */
  export function receiveRecordCount(recordCount: number): Actions.ReceiveRecordCount {
    return createAction(Actions.RECEIVE_RECORD_COUNT, recordCount);
  }

  /**
   * The redirect to receive and update state with.
   * @param redirect - The redirect state will update to.
   * @return - Action with redirect.
   */
  export function receiveRedirect(redirect: string): Actions.ReceiveRedirect {
    return createAction(Actions.RECEIVE_REDIRECT, redirect);
  }

  /**
   * The siteParams to receive and update state with.
   * @param params - The siteParams from the response.
   * @return - Action with siteParams.
   */
  export function receiveSiteParams(params: Store.SiteParams[]): Actions.ReceiveSiteParams {
    return createAction(Actions.RECEIVE_SITE_PARAMS, params);
  }

  /**
   * The more refinements to receive and update state with.
   * @param navigationId - The navigation the more refinements correspond to.
   * @param refinements - The more refinements.
   * @param selected - The selected array, indicating which indexes of the refinements are set to selected.
   * @return - Action with navigationId, refinements, and selected.
   */
  // tslint:disable-next-line max-line-length
  export function receiveMoreRefinements(navigationId: string, refinements: Store.Refinement[], selected: number[]): Actions.ReceiveMoreRefinements {
    return createAction(Actions.RECEIVE_MORE_REFINEMENTS, { navigationId, refinements, selected });
  }

  /**
   * The more past purchase refinements to receive and update state with.
   * @param navigationId - The navigation the more refinements correspond to.
   * @param refinements - The more refinements.
   * @param selected - The selected array, indicating which indexes of the refinements are set to selected.
   * @return - Action with navigationId, refinements, and selected.
   */
  // tslint:disable-next-line max-line-length
  export function receiveMorePastPurchaseRefinements(navigationId: string, refinements: Store.Refinement[], selected: number[]): Actions.ReceiveMorePastPurchaseRefinements {
    return createAction(Actions.RECEIVE_MORE_PAST_PURCHASE_REFINEMENTS, { navigationId, refinements, selected });
  }

  /**
   * The autocomplete suggestions to receive and update state with.
   * @param suggestions - The suggestions to update the state to.
   * @return - Action with suggestions.
   */
  // tslint:disable-next-line max-line-length
  export function receiveAutocompleteSuggestions(suggestions: Actions.Payload.Autocomplete.Suggestions): Actions.ReceiveAutocompleteSuggestions {
    return createAction(Actions.RECEIVE_AUTOCOMPLETE_SUGGESTIONS, suggestions);
  }

  /**
   * The more products to receive and update state with. Products will be added on
   * to the products array in the store.
   * @param products - The products to add to the state.
   * @return - Action with products.
   */
  export function receiveMoreProducts(res: Results) {
    return (state: Store.State): Actions.ReceiveMoreProducts => {
      // tslint:disable-next-line max-line-length
      return handleError(createAction(Actions.RECEIVE_MORE_PRODUCTS, res), () => createAction(Actions.RECEIVE_MORE_PRODUCTS, SearchAdapter.augmentProducts(res)));
    };
  }

  /**
   * The autocomplete response to receive and update state with.
   * @param res - Response object, as returned in the request.
   * @return - Action and res.
   */
  export function receiveAutocompleteProducts(res: Results) {
    return (state: Store.State): Actions.Action<string, any>[] | Actions.ReceiveAutocompleteProducts => {
      const receiveProductsAction = createAction(Actions.RECEIVE_AUTOCOMPLETE_PRODUCTS, res);

      return handleError(receiveProductsAction, () => [
        receiveProductsAction,
        ActionCreators.receiveAutocompleteProductRecords(SearchAdapter.augmentProducts(res)),
        ActionCreators.receiveAutocompleteTemplate(SearchAdapter.extractTemplate(res.template)),
      ]);
    };
  }

  /**
   * The autocomplete products to receive and update state with.
   * @param products - The products to add to the autocomplete state.
   * @return - Action with products.
   */
  // tslint:disable-next-line max-line-length
  export function receiveAutocompleteProductRecords(products: Store.ProductWithMetadata[]): Actions.ReceiveAutocompleteProductRecords {
    return createAction(Actions.RECEIVE_AUTOCOMPLETE_PRODUCT_RECORDS, products);
  }

  /**
   * The autocomplete template to receive and update state with.
   * @param template - The template to add to the autocomplete state.
   * @return - Action with template.
   */
  export function receiveAutocompleteTemplate(template: Store.Template): Actions.ReceiveAutocompleteTemplate {
    return createAction(Actions.RECEIVE_AUTOCOMPLETE_TEMPLATE, template);
  }

  /**
   * The recommendations products to receive and update state with.
   * @param products - The products to add to the recommendations state.
   * @return - Action with products.
   */
  // tslint:disable-next-line max-line-length
  export function receiveRecommendationsProducts(products: Store.ProductWithMetadata[]): Actions.ReceiveRecommendationsProducts {
    return createAction(Actions.RECEIVE_RECOMMENDATIONS_PRODUCTS, products);
  }

  /**
   * The navigation sort to receive and update navigation sort state with.
   * @param navigations - The navigations to be sorted and order of sort.
   * @return - Action with navigations.
   */
  // tslint:disable-next-line max-line-length
  export function receiveNavigationSort(navigations: Store.Recommendations.Navigation[]): Actions.ReceiveNavigationSort {
    return createAction(Actions.RECEIVE_NAVIGATION_SORT, navigations);
  }

  /**
   * Sets the details product in the store.
   * @param details - The product to use as the details product.
   * @return - Action with details.
   */
  export function receiveDetails(details: Store.Details): Actions.ReceiveDetails {
    return createAction(Actions.RECEIVE_DETAILS, details);
  }

  /**
   * Sets the past purchase skus in the store.
   * @param products - The product skus to use.
   * @return - Action with skus.
   */
  // tslint:disable-next-line max-line-length
  export function receivePastPurchaseSkus(products: Store.PastPurchases.PastPurchaseProduct[]): Actions.ReceivePastPurchaseSkus {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_SKUS, products);
  }

  /**
   * Sets the past purchase sayt products in the store.
   * @param products - The products to use.
   * @return - Action with products.
   */
  // tslint:disable-next-line max-line-length
  export function receiveSaytPastPurchases(products: Store.ProductWithMetadata[]): Actions.ReceiveSaytPastPurchases {
    return createAction(Actions.RECEIVE_SAYT_PAST_PURCHASES, products);
  }

  /**
   * Sets the past purchase products in the store.
   * @param products - The products to use.
   * @return - Action with products.
   */
  // tslint:disable-next-line max-line-length
  export function receivePastPurchaseProducts(products: Store.ProductWithMetadata[]): Actions.ReceivePastPurchaseProducts {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_PRODUCTS, products);
  }

  /**
   * Sets the past purchase template in the store.
   * @param template - The template to use.
   * @return - Action with template.
   */
  export function receivePastPurchaseTemplate(template: Store.Template): Actions.ReceivePastPurchaseTemplate {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_TEMPLATE, template);
  }

  /**
   * Sets the past purchases siteParams in the store.
   * @param siteParams - The siteParams to use.
   * @return - Action with siteParams.
   */
  export function receivePastPurchaseSiteParams(siteParams: Store.SiteParams[]): Actions.ReceivePastPurchaseSiteParams {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_SITE_PARAMS, siteParams);
  }

  /**
   * Adds the more past purchase products in the store.
   * @param res - The response to use.
   * @return - Actions with payloads.
   */
  export function receiveMorePastPurchaseProducts(res: Results) {
    return (state: Store.State): Actions.ReceiveMorePastPurchaseProducts => {
      // tslint:disable-next-line max-line-length
      return handleError(createAction(Actions.RECEIVE_MORE_PAST_PURCHASE_PRODUCTS, res), () => createAction(Actions.RECEIVE_MORE_PAST_PURCHASE_PRODUCTS, SearchAdapter.augmentProducts(res)));
    };
  }

  /**
   * Sets the past purchase all record count in the store.
   * @param count - The count to use.
   * @return - Action with count.
   */
  // tslint:disable-next-line max-line-length
  export function receivePastPurchaseAllRecordCount(count: number): Actions.ReceivePastPurchaseAllRecordCount {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_ALL_RECORD_COUNT, count);
  }

  /**
   * Sets the past purchase current record count in the store.
   * @param count - The count to use.
   * @return - Action with count.
   */
  // tslint:disable-next-line max-line-length
  export function receivePastPurchaseCurrentRecordCount(count: number): Actions.ReceivePastPurchaseCurrentRecordCount {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_CURRENT_RECORD_COUNT, count);
  }

  /**
   * Sets the past purchase refinements in the store.
   * @param refinements - The refinements to use.
   * @return - Action with refinements.
   */
  // tslint:disable-next-line max-line-length
  export function receivePastPurchaseRefinements(refinements: Store.Navigation[]): Actions.ReceivePastPurchaseRefinements {
    return createAction(Actions.RECEIVE_PAST_PURCHASE_REFINEMENTS, refinements);
  }

  /**
   * In the past purchase section, sets the current page in the store to page 1, but does not update the search.
   * @return - Action with undefined.
   */
  export function resetPastPurchasePage(): Actions.ResetPastPurchasePage {
    return createAction(Actions.RESET_PAST_PURCHASE_PAGE, undefined, {
      payload: validators.notOnFirstPastPurchasePage
    });
  }

  /**
   * The page to receive and update state with.
   * @param recordCount - The current recordCount.
   * @param current - The current page.
   * @return - Action with page.
   */
  export function receivePastPurchasePage(recordCount: number, current?: number, pageSize?: number) {
    return (state: Store.State): Actions.ReceivePastPurchasePage => {
      return createAction(
        Actions.RECEIVE_PAST_PURCHASE_PAGE,
        SearchAdapter.extractPage(state, recordCount, current, pageSize)
      );
    };
  }

  /**
   * In the past purchase section, selects a given refinement based on navigationId and index.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @param index - The index of the refinement intended to be selected.
   * @return - Actions with relevant data.
   */
  // tslint:disable-next-line max-line-length
  export function selectPastPurchaseRefinement(navigationId: string, index: number): Actions.PastPurchaseSelect {
    return [
      ActionCreators.resetPastPurchasePage(),
      createAction(Actions.SELECT_PAST_PURCHASE_REFINEMENT, { navigationId, index }, {
        payload: validators.isPastPurchaseRefinementDeselectedByIndex
      })
    ];
  }

  /**
   * In the past purchase section, selects the given refinements based on navigationId and indices.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @param indices - The indices of the refinements intended to be selected.
   * @return - Actions with relevant data.
   */
  // tslint:disable-next-line max-line-length
  export function selectMultiplePastPurchaseRefinements(navigationId: string, indices: number[]): Actions.PastPurchaseSelectMultiple {
    return [
      ActionCreators.resetPastPurchasePage(),
      createAction(Actions.SELECT_MULTIPLE_PAST_PURCHASE_REFINEMENTS, { navigationId, indices }, {
        payload: validators.areMultipleRefinementsDeselectedByIndex
      }),
    ];
  }

  /**
   * Removes the currently selected past purchase refinements and selects the given one.
   * @param navigationId - The navigationId for the refinement intending to be selected.
   * @param index - The index of the refinement to be selected in the store.
   * @return - Actions with payloads.
   */
  // tslint:disable-next-line max-line-length
  export function resetAndSelectPastPurchaseRefinement(navigationId: string, index: number): Actions.PastPurchaseResetAndSelect {
    return <Actions.PastPurchaseResetAndSelect>[
      ...ActionCreators.resetPastPurchaseRefinements(true),
      ...ActionCreators.selectPastPurchaseRefinement(navigationId, index),
    ];
  }

  /**
   * Removes the current past purchase query and selects the given past purchase refinement.
   * @param navigationId - The navigationId for the refinement intending to be selected.
   * @param index - The index of the refinement to be selected in the store.
   * @return - Actions with payloads.
   */
  // tslint:disable-next-line max-line-length
  export function resetPastPurchaseQueryAndSelectRefinement(navigationId: string, index: number): Actions.PastPurchaseQueryAndSelect {
    return <Actions.PastPurchaseQueryAndSelect>[
      ...ActionCreators.updatePastPurchaseQuery(''),
      ...ActionCreators.selectPastPurchaseRefinement(navigationId, index),
    ];
  }

  /**
   * In the past purcahse page, removes a given refinement based on navigationId and index.
   * @param navigationId - The navigationId for the navigation to fetch more refinements against.
   * @param index - The index of the refinement intended to be selected.
   * @return - Actions with relevant data.
   */
  // tslint:disable-next-line max-line-length
  export function deselectPastPurchaseRefinement(navigationId: string, index: number): Actions.PastPurchaseDeselect {
    return [
      ActionCreators.resetPastPurchasePage(),
      createAction(Actions.DESELECT_PAST_PURCHASE_REFINEMENT, { navigationId, index }, {
        payload: validators.isPastPurchaseRefinementSelectedByIndex
      })
    ];
  }

  /**
   * In the past purchase page, removes the selected refinements from the search.
   * @param field - true to reset all refinements,
   * or navigationId to reset all refinements on a specific navigation.
   * @return - Actions with relevant data.
   */
  export function resetPastPurchaseRefinements(field?: boolean | string): Actions.PastPurchaseReset {
    return [
      ActionCreators.resetPastPurchasePage(),
      createAction(Actions.RESET_PAST_PURCHASE_REFINEMENTS, field, {
        payload: [
          validators.isValidClearField,
          validators.hasSelectedPastPurchaseRefinements,
          validators.hasSelectedPastPurchaseRefinementsByField
        ]
      })
    ];
  }

  /**
   * Removes the selected past purchase refinements and updates the past purchase query.
   * @param query - The query to use.
   * @return - Actions with payloads.
   */
  export function updatePastPurchaseQuery(query: string): Actions.PastPurchaseQuery {
    return <Actions.PastPurchaseQuery>[
      ...ActionCreators.resetPastPurchaseRefinements(true),
      createAction(Actions.UPDATE_PAST_PURCHASE_QUERY, query),
    ];
  }

  /**
   * Updates the past purchase page size to given size.
   * @param size - The size the page is updated to. Must correspond to a size in the pageSize in the store.
   * @return - Action with size.
   */
  export function updatePastPurchasePageSize(size: number): Actions.UpdatePastPurchasePageSize {
    return createAction(Actions.UPDATE_PAST_PURCHASE_PAGE_SIZE, size, {
      payload: validators.isDifferentPastPurchasePageSize
    });
  }

  /**
   * Updates the current page to the given page.
   * @param page - The page to switch to.
   * @return - Action with page.
   */
  export function updatePastPurchaseCurrentPage(page: number): Actions.UpdatePastPurchaseCurrentPage {
    return createAction(Actions.UPDATE_PAST_PURCHASE_CURRENT_PAGE, page, {
      payload: [
        validators.isValidPastPurchasePage,
        validators.isOnDifferentPastPurchasePage
      ]
    });
  }

  /**
   * Updates the past purchase sort.
   * @param index - The index of the sort in the store to use.
   * @return - Action with index.
   */
  export function selectPastPurchasesSort(index: number): Actions.PastPurchaseSortActions {
    return [
      ActionCreators.resetPastPurchasePage(),
      createAction(Actions.SELECT_PAST_PURCHASE_SORT, index, {
        payload: validators.isPastPurchasesSortValid
      })
    ];
  }

  /**
   * Updates the past purchase sorts using the data provided.
   * @param payload - An object containing the sort labels and options.
   * @return - Action with payload.
   */
  export function applyPastPurchaseSorts(payload: Actions.Payload.Sort): Actions.ApplyPastPurchaseSorts {
    return createAction(Actions.APPLY_PAST_PURCHASE_SORTS, payload, {
      payload: [
        validators.hasValidLabels,
        validators.hasValidOptions,
        validators.hasValidSelected,
      ],
    });
  }

  // ui action creators
  /**
   * Adds state for a given tag or section to the ui store.
   * @param tagName - The name of the tag or a unique identifier.
   * @param id - The id of the component or a unique id to use.
   * @param state - The state to add in the store.
   * @return - Action with tagName, id, and state.
   */
  // tslint:disable-next-line max-line-length
  export function createComponentState(tagName: string, id: string, state: any = {}): Actions.CreateComponentState {
    return createAction(Actions.CREATE_COMPONENT_STATE, { tagName, id, state });
  }

  /**
   * Removes state for a given tag from the store.
   * @param tagName - The name of the tag or a unique identifier.
   * @param id - The id of the component or a unique id to use.
   * @return - Action with tagName and id.
   */
  export function removeComponentState(tagName: string, id: string): Actions.RemoveComponentState {
    return createAction(Actions.REMOVE_COMPONENT_STATE, { tagName, id });
  }

  // session action creators
  /**
   * Updates the location in the store to the given location.
   * @param location - The location to update to.
   * @return - Action with location.
   */
  export function updateLocation(location: Store.Geolocation): Actions.UpdateLocation {
    return createAction(Actions.UPDATE_LOCATION, location);
  }

  /**
   * Set the sessionId in the store to the given id.
   * @param sessionId - The sessionId to set.
   * @return - Action with sessionId.
   */
  export function setSessionId(sessionId: Store.SessionId): Actions.SetSessionId {
    return createAction(Actions.SET_SESSION_ID, sessionId);
  }

  // app action creators
  /**
   * Fires the START_APP action.
   * @return - Action with undefined.
   */
  export function startApp(): Actions.StartApp {
    return createAction(Actions.START_APP, undefined);
  }
}

export default ActionCreators;
