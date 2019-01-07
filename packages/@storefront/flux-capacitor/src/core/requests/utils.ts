import { FieldSort, Request } from 'groupby-api';
import { QueryTimeAutocompleteConfig } from 'sayt';
import Autocomplete from '../adapters/autocomplete';
import Configuration from '../adapters/configuration';
import PastPurchaseAdapter from '../adapters/past-purchases';
import PersonalizationAdapter from '../adapters/personalization';
import RecommendationsAdapter from '../adapters/recommendations';
import RequestAdapter from '../adapters/request';
import Selectors from '../selectors';
import Store from '../store';

namespace RequestHelpers {
  export type RequestBody = RecommendationsAdapter.RecommendationsBody
    | RecommendationsAdapter.RecommendationsRequest
    | RecommendationsAdapter.PastPurchaseRequest;

  export const buildPostBody = (body: RequestBody) => ({
    method: 'POST',
    body: JSON.stringify(body)
  });

  export type BuildFunction<T, S> = (state: Store.State, overrideRequest?: T) => S;

  export const search: BuildFunction<Partial<Request>, Request> = (state, overrideRequest = {}) => {
    const config = Selectors.config(state);
    const sort = Selectors.sort(state);
    const page = Selectors.page(state);
    const pageSize = Selectors.pageSize(state);
    const skip = RequestAdapter.extractSkip(page, pageSize);
    const request: Partial<Request> = {
      pageSize: RequestAdapter.clampPageSize(page, pageSize),
      area: Selectors.area(state),
      fields: Selectors.fields(state),
      query: Selectors.query(state),
      collection: Selectors.collection(state),
      refinements: Selectors.selectedRefinements(state),
      skip
    };

    const language = Configuration.extractLanguage(config);
    if (language) {
      request.language = language;
    }
    if (sort) {
      request.sort = <any>RequestAdapter.extractSort(sort);
    }
    if (Configuration.shouldAddPastPurchaseBias(config)) {
      request.biasing = PastPurchaseAdapter.pastPurchaseBiasing(state);
    }

    return <Request>{ ...request, ...overrideRequest };
  };

  export const pastPurchaseProducts: BuildFunction<Partial<Request>, Request> = (state, overrideRequest = {}) => {
    const request: Partial<Request> = {
      ...RequestHelpers.search(state),
      ...PastPurchaseAdapter.biasSkus(state),
      pageSize: Selectors.pastPurchasePageSize(state),
      query: Selectors.pastPurchaseQuery(state),
      refinements: Selectors.pastPurchaseSelectedRefinements(state),
      skip: Selectors.pastPurchasePageSize(state) * (Selectors.pastPurchasePage(state) - 1),
      sort: RequestAdapter.extractPastPurchaseSort(
        Selectors.pastPurchaseSortSelected(state),
        Selectors.pastPurchases(state)
      ),
    };

    return <Request>{ ...request, ...overrideRequest };
  };

  // tslint:disable-next-line max-line-length
  export const recommendationsSuggestions: BuildFunction<Partial<RecommendationsAdapter.Request & { query: string }>, RecommendationsAdapter.Request> = (state, overrideRequest = {}) => {
    const config = Selectors.config(state);
    const { query = false, ...restOfOverrideRequest } = overrideRequest;

    const request = RecommendationsAdapter.addLocationToRequest({
      size: config.autocomplete.recommendations.suggestionCount,
      matchPartial: {
        and: [{
          search: {
            query: query !== false ? query : Selectors.query(state),
          }
        }]
      }
    }, state);

    return { ...request, ...restOfOverrideRequest };
  };

  // tslint:disable-next-line max-line-length
  export const recommendationsNavigations: BuildFunction<Partial<RecommendationsAdapter.RecommendationsBody>, RecommendationsAdapter.RecommendationsBody> = (state, overrideRequest = {}) => {
    const query = Selectors.query(state);
    const iNav = Selectors.config(state).recommendations.iNav;
    const sizeAndWindow = { size: iNav.size, window: iNav.window };
    // tslint:disable-next-line max-line-length
    const request = {
      minSize: iNav.minSize || iNav.size,
      sequence: [
        {
          ...sizeAndWindow,
          matchPartial: {
            and: [{ search: { query } }]
          },
        },
        sizeAndWindow,
      ]
    };

    return { ...request, ...overrideRequest };
  };

  // tslint:disable-next-line max-line-length
  export const recommendationsProductIDs: BuildFunction<Partial<RecommendationsAdapter.RecommendationsRequest>, RecommendationsAdapter.RecommendationsRequest> = (state, overrideRequest = {}) => {
    const config = Selectors.config(state);

    const request = RecommendationsAdapter.addLocationToRequest({
      size: config.recommendations.productSuggestions.productCount,
      type: 'viewProduct',
      target: config.recommendations.idField
    }, state);

    return { ...request, ...overrideRequest };
  };

  // tslint:disable-next-line max-line-length
  export const autocompleteSuggestions: BuildFunction<Partial<QueryTimeAutocompleteConfig>, QueryTimeAutocompleteConfig> = (state, overrideRequest = {}) => {
    const config = Selectors.config(state);
    const request = {
      language: Autocomplete.extractLanguage(config),
      numSearchTerms: Configuration.extractAutocompleteSuggestionCount(config),
      numNavigations: Configuration.extractAutocompleteNavigationCount(config),
      sortAlphabetically: Configuration.isAutocompleteAlphabeticallySorted(config),
      fuzzyMatch: Configuration.isAutocompleteMatchingFuzzily(config),
    };

    return { ...request, ...overrideRequest };
  };

  export const autocompleteProducts: BuildFunction<Partial<Request>, Request> = (state, overrideRequest = {}) => {
    const config = Selectors.config(state);

    let request: Request = RequestHelpers.search(state, {
      refinements: [],
      skip: 0,
      sort: undefined,
      language: Autocomplete.extractProductLanguage(config),
      area: Autocomplete.extractProductArea(config),
      pageSize: Configuration.extractAutocompleteProductCount(config)
    });

    if (config.personalization.realTimeBiasing.autocomplete) {
      request = RequestHelpers.realTimeBiasing(state, request);
    }

    return <Request>{ ...request, ...overrideRequest };
  };

  export const products: BuildFunction<Partial<Request>, Request> = (state, overrideRequest = {}) =>
    ({ ...RequestHelpers.realTimeBiasing(state, RequestHelpers.search(state)), ...overrideRequest });

  // tslint:disable-next-line max-line-length
  export const realTimeBiasing = (state: Store.State, request: Request): Request => {
    const addedBiases = PersonalizationAdapter.convertBiasToSearch(state, request.refinements);

    return {
      ...request,
      biasing: {
        ...request.biasing,
        biases: (request.biasing && request.biasing.biases || []).concat(addedBiases),
      }
    };
  };

  export const chain = <T>(...fns: Array<(...obj: any[]) => T>): T =>
    fns.reduce((final, fn) => fn(final) || final, <T>{});
}

export default RequestHelpers;
