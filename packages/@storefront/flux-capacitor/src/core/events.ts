namespace Events {
  /**
   * Triggered when the original query is updated.
   * Returns the original query.
   */
  export const ORIGINAL_QUERY_UPDATED = 'original_query_updated'; // pre
  /**
   * Triggered when the corrected query is updated.
   * Returns the corrected query.
   */
  export const CORRECTED_QUERY_UPDATED = 'corrected_query_updated'; // post
  /**
   * Triggered when related queries are updated.
   * Returns the related queries.
   */
  export const RELATED_QUERIES_UPDATED = 'related_queries_updated'; // post
  /**
   * Triggered when did you means are updated.
   * Returns the did you means.
   */
  export const DID_YOU_MEANS_UPDATED = 'did_you_means_updated'; // post
  /**
   * Triggered when query rewrites are updated.
   * Returns the query rewrites.
   */
  export const QUERY_REWRITES_UPDATED = 'query_rewrites_updated'; // post

  // sort events
  /**
   * Triggered when sorts are updated.
   * Returns the sorts object.
   */
  export const SORTS_UPDATED = 'sorts_updated'; // mixed

  // product events
  /**
   * Triggered when products are updated.
   * Returns the products.
   */
  export const PRODUCTS_UPDATED = 'products_updated'; // mixed
  /**
   * Triggered when more products are added to the products array.
   * Returns the new products.
   */
  export const MORE_PRODUCTS_ADDED = 'more_products_added'; // post

  // collection events
  /**
   * Triggered when collection object is updated.
   * Returns the collection object.
   */
  export const COLLECTION_UPDATED = 'collection_updated'; // post
  /**
   * Triggered when selected collection is updated.
   * Returns the selected collection.
   */
  export const SELECTED_COLLECTION_UPDATED = 'selected_collection_updated'; // post

  // navigation events
  /**
   * Triggered when navigations are updated.
   * Returns the navigations object.
   */
  export const NAVIGATIONS_UPDATED = 'navigations_updated'; // post
  /**
   * Triggered when selected refinements are updated.
   * Listened to in the format 'selected_refinements_updated:id', where id is the
   * refinement's id.
   * Returns the selected refinement.
   */
  export const SELECTED_REFINEMENTS_UPDATED = 'selected_refinements_updated'; // post

  // autocomplete events
  /**
   * Triggered when autocomplete query is updated.
   * Returns the autocomplete query.
   */
  export const AUTOCOMPLETE_QUERY_UPDATED = 'autocomplete_query_updated'; // pre
  /**
   * Triggered when autocomplete suggestions are updated.
   * Returns the autocomplete suggestions.
   */
  export const AUTOCOMPLETE_SUGGESTIONS_UPDATED = 'autocomplete_suggestions_updated'; // post
  /**
   * Triggered when autocomplete product suggestions are updated.
   * Returns the autocomplete products.
   */
  export const AUTOCOMPLETE_PRODUCTS_UPDATED = 'autocomplete_products_updated'; // post
  /**
   * Triggered when autocomplete template is updated.
   * Returns the autocomplete template.
   */
  export const AUTOCOMPLETE_TEMPLATE_UPDATED = 'autocomplete_template_updated'; // post

  // template events
  /**
   * Triggered when template is updated.
   * Returns the template.
   */
  export const TEMPLATE_UPDATED = 'template_updated'; // post

  // details events
  /**
   * Triggered when details page is updated.
   * Returns the details data.
   */
  export const DETAILS_UPDATED = 'details_updated'; // pre

  // page events
  /**
   * Triggered when page object is updated.
   * Returns the page object.
   */
  export const PAGE_UPDATED = 'page_updated'; // post
  /**
   * Triggered when page size is updated.
   * Returns the sizes object.
   */
  export const PAGE_SIZE_UPDATED = 'page_size_updated'; // pre
  /**
   * Triggered when current page is updated.
   * Returns the current page number.
   */
  export const CURRENT_PAGE_UPDATED = 'current_page_updated'; // pre

  /**
   * Triggered when infinite scroll is updated.
   * Returns the current infinite scroll object.
   */
  export const INFINITE_SCROLL_UPDATED = 'infinite_scroll_updated';

  // record count event
  /**
   * Triggered when record count is updated.
   * Returns the record count number.
   */
  export const RECORD_COUNT_UPDATED = 'record_count_updated'; // post

  // request state change events
  /**
   * Triggered when the recallId changes. Occurs when a new search with
   * different refinements selected or a new query is fired.
   * Returns the recallId.
   */
  export const RECALL_CHANGED = 'recall_changed';
  /**
   * Triggered when searchId changes. Occurs whenever a new search is fired.
   * Returns the searchId.
   */
  export const SEARCH_CHANGED = 'search_changed';
  /**
   * Triggered when detailsId changes. Occurs whenever a new details search is fired.
   * Returns the searchId.
   */
  export const DETAILS_CHANGED = 'details_changed';
  /**
   * Triggered when pastPurchaseId changes. Occurs whenever a new past purchase search is fired.
   * Returns the pastPurchaseId.
   */
  export const PAST_PURCHASE_CHANGED = 'past_purchase_changed';

  // redirect event
  /**
   * Triggered when redirect occurs.
   * Returns the redirect.
   */
  export const REDIRECT = 'redirect';

  // recommendations events
  /**
   * Triggered when recommendations products are updated.
   * Returns the recommendations products object.
   */
  export const RECOMMENDATIONS_PRODUCTS_UPDATED = 'recommendations_products_updated';

  /**
   * Triggered when past purchases are updated
   * Returns the past purchases products array
   */
  export const PAST_PURCHASES_UPDATED = 'past_purchases_updated';

  /**
   * Triggered when the product ids of the past purchase products are updated
   * Returns the new array of past purchase skus
   */
  export const PAST_PURCHASE_SKUS_UPDATED = 'past_purchase_skus_updated';

  /**
   * Triggered when the current past purchase products to show in the sayt menu are updated
   * Returns the new product array
   */
  export const SAYT_PAST_PURCHASES_UPDATED = 'sayt_past_purchases_updated';

  /**
   * Triggered when the past purchase products are updated
   * Returns an array of the new past purchase products
   */
  export const PAST_PURCHASE_PRODUCTS_UPDATED = 'past_purchase_products_updated';

  /**
   * Triggered when the more past purchase products are added
   * Returns an array of the new past purchase products that were added
   */
  export const PAST_PURCHASE_MORE_PRODUCTS_ADDED = 'past_purchase_more_products_added';

  /**
   * Triggered when the past purchase navigations are updated
   * Returns the new navigations
   */
  export const PAST_PURCHASE_NAVIGATIONS_UPDATED = 'past_purchase_navigations_updated';

  /**
   * Triggered when the past purchase query is updated
   * Returns the new query
   */
  export const PAST_PURCHASE_QUERY_UPDATED = 'past_purchase_query_updated';

  /**
   * Triggered when the past purchase page object is updated
   * Returns the new page object
   */
  export const PAST_PURCHASE_PAGE_UPDATED = 'past_purchase_page_updated';

  /**
   * Triggered when the past purchase current page number is udpated
   * Returns the new page number
   */
  export const PAST_PURCHASE_CURRENT_PAGE_UPDATED = 'past_purchase_current_page_updated';

  /**
   * Triggered when the past purchse page size is updated
   * Returns the new page size
   */
  export const PAST_PURCHASE_PAGE_SIZE_UPDATED = 'past_purchase_page_size_updated';

  /**
   * Triggered when the past purchase sort object is updated
   * Returns the new sort object
   */
  export const PAST_PURCHASE_SORT_UPDATED = 'past_purchase_sort_updated';

  /**
   * Triggered when the past purchase allRecordCount is updated
   * Returns the new record count
   */
  export const PAST_PURCHASE_RECORD_COUNT_UPDATED = 'past_purchase_record_count_updated';

  /**
   * Triggered when past purchase selected refinements are updated.
   * Listened to in the format 'selected_refinements_updated:id', where id is the
   * refinement's id.
   * Returns the selected refinement.
   */
  export const PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED = 'past_purchase_selected_refinements_updated'; // post

  /**
   * Triggered when past purchase template is updated.
   * Returns the past purchase template
   */
  export const PAST_PURCHASE_TEMPLATE_UPDATED = 'past_purchase_template_updated';

  // error events
  /**
   * Triggered when an action error occurs.
   * Returns the error.
   */
  export const ERROR_ACTION = 'error:action';
  /**
   * Triggered when a bridge error occurs.
   * Returns the error.
   */
  export const ERROR_BRIDGE = 'error:bridge';
  /**
   * Triggered when a fetch action error occurs.
   * Returns the error.
   */
  export const ERROR_FETCH_ACTION = 'error:fetch_action';

  // ui events
  /**
   * Triggered when the UI section of the store is updated.
   * Listened to in the format 'ui:updated:tagName:id', where tagName is the
   * name of the tag, and id is the tag's id.
   */
  export const UI_UPDATED = 'ui:updated';

  // app events
  /**
   * Triggered when the app is started.
   * Returns true.
   */
  export const APP_STARTED = 'app:started';
  /**
   * Triggered when the app is killed.
   * Returns false.
   */
  export const APP_KILLED = 'app:killed';

  // location events
  /**
   * Triggered when the location is updated.
   * Returns the location.
   */
  export const LOCATION_UPDATED = 'location:updated';

  // tracker events
  /**
   * Triggered when a search beacon is sent.
   * Returns the search id from the search response.
   */
  export const BEACON_SEARCH = 'beacon:search';
  /**
   * Triggered when a view product beacon is sent.
   * Returns the product viewed.
   */
  export const BEACON_VIEW_PRODUCT = 'beacon:view_product';
  /**
   * Triggered when an add to cart beacon is sent.
   */
  export const BEACON_ADD_TO_CART = 'beacon:add_to_cart';
  /**
   * Triggered when a remove from cart beacon is sent.
   */
  export const BEACON_REMOVE_FROM_CART = 'beacon:remove_from_cart';
  /**
   * Triggered when a view cart beacon is sent.
   */
  export const BEACON_VIEW_CART = 'beacon:view_cart';
  /**
   * Triggered when an order beacon is sent.
   */
  export const BEACON_ORDER = 'beacon:order';
  /**
   * Triggered when more refinements beacon is sent
   */
  export const BEACON_MORE_REFINEMENTS = 'beacon:more_refinements';

  // observer events
  /**
   * INTERNAL EVENT: Triggered when an observer node has changed.
   */
  export const OBSERVER_NODE_CHANGED = 'observer:node_changed';

  // tag events
  /**
   * INTERNAL EVENT: Used by logging service to indicate tag lifecycle event has occurred.
   */
  export const TAG_LIFECYCLE = 'tag:lifecycle';
  /**
   * INTERNAL EVENT: Used by logging service to indicate tag aliasing event has occurred.
   */
  export const TAG_ALIASING = 'tag:aliasing';

  // history events
  /**
   * Triggered when history is saved.
   * Returns the state.
   */
  export const HISTORY_SAVE = 'history:save';
  /**
   * Triggered when history is replaced.
   * Returns the state.
   */
  export const HISTORY_REPLACE = 'history:replace';

  // url events
  /**
   * Triggered when the url is updated, the route is search, and a search request should be made.
   */
  export const SEARCH_URL_UPDATED = 'search_url:updated';
  /**
   * Triggered when the url is updated, the route is details, and a details request should be made.
   */
  export const DETAILS_URL_UPDATED = 'details_url:updated';
  /**
   * Triggered when the url is updated, the route is past purchases, and a past purchase request should be made.
   */
  export const PAST_PURCHASE_URL_UPDATED = 'past_purchase_url:updated';
  /**
   * Triggered when the url is updated, the route is custom, and a custom request should be made.
   */
  export const CUSTOM_URL_UPDATED = 'custom_url:updated';
  /**
   * Triggered when the url is updated.
   * Returns the url.
   */
  export const URL_UPDATED = 'url:updated';
  /**
   * Triggered when the route is updated.
   * Returns the route.
   */
  export const ROUTE_UPDATED = 'route:updated';

  // personalization events
  /**
   * Triggered when biasing is rehydrated
   * returns true
   */
  export const PERSONALIZATION_BIASING_REHYDRATED = 'personalization:biasing_rehydrated';

  // fetch Events
  /**
   * Triggered when more refinements is fetching
   * returns true
   */
  export const FETCHING_MORE_REFINEMENTS = 'fetching:more_refinements';
  /**
   * Triggered when more products is fetching
   * returns true
   */
  export const FETCHING_MORE_PRODUCTS = 'fetching:more_products';
  /**
   * Triggered when search is fetching
   * returns true
   */
  export const FETCHING_SEARCH = 'fetching:search';
  /**
   * Triggered when autocomplete suggestions is fetching
   * returns true
   */
  export const FETCHING_AUTOCOMPLETE_SUGGESTIONS = 'fetching:autocomplete_suggestions';
  /**
   * Triggered when autocomplete products is fetching
   * returns true
   */
  export const FETCHING_AUTOCOMPLETE_PRODUCTS = 'fetching:autocomplete_products';
  /**
   * Triggered when more details is fetching
   * returns true
   */
  export const FETCHING_DETAILS = 'fetching:details';
  /**
   * Triggered when more refinements is done fetching
   * returns false
   */
  export const DONE_MORE_REFINEMENTS = 'done:more_refinements';
  /**
   * Triggered when more products is done fetching
   * returns false
   */
  export const DONE_MORE_PRODUCTS = 'done:more_products';
  /**
   * Triggered when search is done fetching
   * returns false
   */
  export const DONE_SEARCH = 'done:search';
  /**
   * Triggered when autocomplete suggestions is done fetching
   * returns false
   */
  export const DONE_AUTOCOMPLETE_SUGGESTIONS = 'done:autocomplete_suggestions';
  /**
   * Triggered when autocomplete products is done fetching
   * returns false
   */
  export const DONE_AUTOCOMPLETE_PRODUCTS = 'done:autocomplete_products';
  /**
   * Triggered when more details is done fetching
   * returns false
   */
  export const DONE_DETAILS = 'done:details';
}

export default Events;
