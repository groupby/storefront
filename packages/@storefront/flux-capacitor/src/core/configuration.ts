import { BiasStrength, BrowserBridge, Request } from 'groupby-api';
import { QueryTimeAutocompleteConfig, QueryTimeProductSearchConfig, Sayt } from 'sayt';
import RecommendationsAdapter from './adapters/recommendations';

interface Configuration {
  /**
   * GroupBy customer ID
   */
  customerId: string;
  /**
   * ID unique to the viewer of the rendered page
   */
  visitorId?: string;
  /**
   * ID unique to the session of the viewer of the rendered page
   */
  sessionId?: string;

  /**
   * area of search data
   */
  area?: string;
  /**
   * input language for the search engine
   */
  language?: string;
  /**
   * collection of search data or collection options
   */
  collection?: Configuration.ValueOptions<string>;

  /**
   * state initial configuration for SAYT
   */
  autocomplete?: Configuration.Autocomplete;

  /**
   * state initial configuration for Searchandiser
   */
  search?: Configuration.Search;

  /**
   * state initial configuration for the collections Searchandiser request
   */
  collections?: Configuration.Collections;

  /**
   * state initial configuration for Recommendations
   */
  recommendations?: Configuration.Recommendations;

  /**
   * state initial configuration for details Searchandiser request
   */
  details?: Configuration.Details;

  /**
   * state initial configuration for the more refinements Searchandiser request
   */
  refinements?: Configuration.Refinements;

  /**
   * state configuration for navigation related data modifications
   */
  navigations?: Configuration.Navigations;

  /**
   * network request configuration
   */
  network?: Configuration.Bridge;

  /**
   * personalization configuration
   */
  personalization?: Configuration.Personalization;

  /**
   * History length can be either 1 or 0. Setting history length to 0 prevents
   * products from being saved into browser history, reducing the chance that
   * the browser size limit will be reached, but forces a re-fetch on history change.
   */
  history?: {
    length?: number;
  };
}

namespace Configuration {
  export interface Bridge {
    /**
     * map of headers to send with search requests
     */
    headers?: { [key: string]: string };
    /**
     * send requests over HTTPS
     */
    https?: boolean;
    /**
     * connection timeout for search requests
     */
    timeout?: number;
    /**
     * global request error handler
     */
    errorHandler?: (error: Error) => void;
    /**
     * add SkipCache header to search requests
     */
    skipCache?: boolean;
    /**
     * add SkipSemantish header to search requests
     */
    skipSemantish?: boolean;

    /**
     * URL to be used in place of the standard GroupBy search URL.
     */
    proxyUrl?: string;
  }

  export interface Clients {
    bridge: BrowserBridge;
    sayt: Sayt;
  }

  export interface Sort {
    /**
     * field path to sort on
     */
    field: string;
    descending?: boolean;
  }

  export interface Search {
    /**
     * product fields to request
     * auto-generated from structure if not provided
     */
    fields?: string[];
    /**
     * number of products to request or sort options and default
     */
    pageSize?: Configuration.ValueOptions<number>;
    /**
     * sorting of products or sort options and default
     */
    sort?: Configuration.ValueOptions<Configuration.Sort>;
    /**
     * redirect to the details page of product if there is only 1 product result for a search
     */
    redirectSingleResult: boolean;
    /**
     * maximum number of refinements to show in a single section
     */
    maxRefinements?: number;
    /**
     * reset the collection to the default collection on a search
     */
    useDefaultCollection?: boolean;
    /**
     * override any computed request value
     */
    overrides?: Configuration.SearchOverrides;
  }

  export type SearchOverrides = Partial<Request> | ((currReq: Request, prevReq: Request) => Request);

  export interface Autocomplete {
    /**
     * area override
     */
    area?: string;
    /**
     * collection override
     */
    collection?: string;
    /**
     * language override
     */
    language?: string;
    /**
     * category field used to render sayt results
     */
    category?: string;
    /**
     * number of characters before activating typeahead
     */
    searchCharMinLimit?: number;
    /**
     * whether to use the first term as a category search
     */
    showCategoryValuesForFirstMatch?: boolean;
    /**
     * number of suggestions to request
     */
    suggestionCount?: number;
    /**
     * number of navigations to request
     */
    navigationCount?: number;
    // TODO: this should go in the tag configuration as it is for display only
    /**
     * map of field to label, also restricts displayed navigations if provided
     */
    navigations?: { [field: string]: string };
    /**
     * whether to sort the returned suggestions alphabetically
     */
    alphabetical?: boolean;
    /**
     * whether to use fuzzy matching for suggestion results
     */
    fuzzy?: boolean;
    /**
     * enable updating query when hovering over sayt elements
     */
    hoverAutoFill?: boolean;
    /**
     * specify optional debounce value in milliseconds
     */
    debounceThreshold?: number;
    /**
     * autocomplete products settings
     */
    products?: Configuration.Autocomplete.Products;
    /**
     * recommendations API settings
     */
    recommendations?: Configuration.Autocomplete.Recommendations;
    /**
     * override any computed request value
     */
    overrides?: {
      // tslint:disable-next-line max-line-length
      suggestions?: Configuration.AutocompleteSuggestionsOverrides;
      // tslint:disable-next-line max-line-length
      products?: Configuration.AutocompleteProductsOverrides;
    };
  }

  // tslint:disable:max-line-length
  export type AutocompleteSuggestionsOverrides = Partial<QueryTimeAutocompleteConfig> | ((currConfig: QueryTimeAutocompleteConfig, prevConfig: QueryTimeAutocompleteConfig) => QueryTimeAutocompleteConfig);
  export type AutocompleteProductsOverrides = Partial<QueryTimeProductSearchConfig> | ((currConfig: QueryTimeProductSearchConfig, prevConfig: QueryTimeProductSearchConfig) => QueryTimeProductSearchConfig);
  // tslint:enable:max-line-length

  export namespace Autocomplete {
    export interface Recommendations {
      /**
       * number of suggestions to request
       */
      suggestionCount: number;
      /**
       * type of product siuggestions to request
       */
      suggestionMode: RecommendationMode;
    }

    export interface Products {
      /**
       * area override
       */
      area?: string;
      /**
       * collection override
       */
      collection?: string;
      /**
       * language override
       */
      language?: string;
      /**
       * number of products to request
       */
      count: number;
    }
  }

  export interface Recommendations {
    /**
     * set object to enable location-specific autocomplete recommendations
     */
    location?: Configuration.Recommendations.Location | false;

    /**
     * Product ID field as used in recommendations.
     */
    idField: string;
    productSuggestions: Configuration.Recommendations.ProductSuggestions;
    iNav: Configuration.Recommendations.INav;
    pastPurchases: Configuration.Recommendations.PastPurchases;

    /**
     * override any computed request value
     */
    overrides?: {
      navigations?: Configuration.RecommendationsNavigationsOverrides;
      ids?: Configuration.RecommendationsIdsOverrides;
      products?: Configuration.SearchOverrides;
      autocompleteSuggestions?: Configuration.RecommendationsSuggestionsOverrides;
    };
  }

  // tslint:disable:max-line-length
  export type RecommendationsNavigationsOverrides = Partial<RecommendationsAdapter.RecommendationsBody> | ((currReq: RecommendationsAdapter.RecommendationsBody, prevReq: RecommendationsAdapter.RecommendationsBody) => RecommendationsAdapter.RecommendationsBody);
  export type RecommendationsIdsOverrides = Partial<RecommendationsAdapter.RecommendationsRequest> | ((currReq: RecommendationsAdapter.RecommendationsRequest, prevReq: RecommendationsAdapter.RecommendationsRequest) => RecommendationsAdapter.RecommendationsRequest);
  export type RecommendationsSuggestionsOverrides = Partial<RecommendationsAdapter.Request & { query: string }> | ((currReq: RecommendationsAdapter.Request & { query: string }, prevReq: RecommendationsAdapter.Request & { query: string }) => RecommendationsAdapter.Request & { query: string });
  // tslint:enable:max-line-length

  export interface Personalization {
    realTimeBiasing?: Personalization.RealTimeBiasing;
  }

  export namespace Recommendations {
    export interface Location {
      minSize: number;
      distance: string;
    }

    export interface ProductSuggestions {
      /**
       * Number of products to request.
       */
      productCount: number;
      /**
       * Type of product recommendations to request.
       */
      mode: Configuration.RecommendationMode;
    }

    export interface PastPurchases {
      /**
       * Number of products to request.
       */
      productCount: number;

      /**
       * Number of past purchase products to bias by.
       */
      biasCount: number;

      /**
       * Overall strength of applied biases.
       */
      biasInfluence: number;

      /**
       * Strength of applied biases.
       */
      biasStrength: BiasStrength;

      /**
       * A security token or a function to retrieve a token
       */
      securedPayload: Recommendations.SecuredPayload | (() => Recommendations.SecuredPayload);

      /**
       * sorting of products or sort options and default
       */
      sort?: Configuration.ValueOptions<Configuration.Sort>;

      /**
       * Enable past purchases or not
       */
      enabled: boolean;

      /**
       * maximum number of refinements to show in a single section
       */
      maxRefinements?: number;

      /**
       * override any computed request value
       */
      overrides?: {
        autocomplete?: Configuration.SearchOverrides;
        products?: Configuration.SearchOverrides;
      };
    }

    export interface SecuredPayload {
      cipherText?: string;
      initialValue?: string;
      messageAuthenticationCode?: string;
    }

    // tslint:disable-next-line interface-name
    export interface INav {
      /**
       * Navigation settings.
       */
      navigations: Navigations;
      /**
       * Refinement settings.
       */
      refinements: Refinements;
      /**
       * Minimum number of navigations required in response.
       */
      minSize?: number;
      /**
       * Maximum number of navigations to return.
       */
      size: number;
      /**
       * Time period of recorded recommendations.
       */
      window: 'day' | 'week' | 'month';
    }

    export interface Navigations {
      /**
       * Whether to sort navigations.
       */
      sort: boolean;
      /**
       * Navigations to pin to the top regardless of recommendations.
       */
      pinned?: string[];
    }

    export interface Refinements {
      /**
       * Whether to sort refinements, or array of what refinements to sort.
       */
      sort: boolean | string[];
      /**
       * Refinements to pin to the top regardless of recommendations.
       */
      pinned?: Configuration.Recommendations.Pinned;
    }

    export interface Pinned {
      [id: string]: string[];
    }
  }

  export interface Navigations {
    /**
     * Remap navigation data type.
     */
    type?: Configuration.Navigations.NavigationType;
  }

  export namespace Navigations {
    export interface NavigationType {
      /**
       * Map of navigation name to data type.
       */
      [key: string]: 'toggle';
    }
  }

  export interface Collections {
    overrides?: Configuration.SearchOverrides;
  }

  export interface Details {
    overrides?: Configuration.SearchOverrides;
  }

  export interface Refinements {
    overrides?: Configuration.SearchOverrides;
  }

  export namespace Personalization {
    export interface RealTimeBiasing {
      attributes?: {
        [attribute: string]: RealTimeBiasingAttribute
      };
      strength: BiasStrength;
      maxBiases: number;
      attributeMaxBiases: number;
      expiry: number;
      autocomplete: boolean;
    }

    export interface RealTimeBiasingAttribute {
      strength: BiasStrength;
      maxBiases: number;
    }
  }

  export type ValueOptions<T> = T | { options: T[], default: T };

  export type RecommendationMode = keyof typeof RECOMMENDATION_MODES;

  export const RECOMMENDATION_MODES = {
    popular: 'Popular',
    trending: 'Trending',
    recent: 'Recent'
  };
}

export default Configuration;
