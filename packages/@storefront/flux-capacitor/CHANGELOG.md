# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [major|minor|patch]
### Added
- SF-1355:
  - Added `START_REDIRECT` and `DONE_REDIRECT` actions.
  - Added `startRedirect()` and `stopRedirect()` action creators.
- <Describe additions>

### Fixed
- SF-1355: Fixed an issue where navigating via redirect resulted in a 'dropped' browser history entry.

## [1.73.1] - 2019-04-24
### Changed
- SF-1335: `sessionId` will now only be sent with `search` requests.
  - `attachSessionId()` has been changed to `extractSessionId()`.
  - The `search` request builder now uses `extractSessionId()` to retrieve the `sessionId` from the application store.

## [1.73.0] - 2019-02-25
### Changed
- SF-1271: `composeRequest()` now uses the `attachSessionId()` to add sessionIds to every StoreFront request.

### Added
- SF-1271: Create `setSessionId` action in order to update the application store with sessionId.

## [1.72.0] - 2019-02-21
### Changed
- SF-1125: Details pages now leverage the new `RequestHelper`, `productDetails`.

### Added
- SF-1125: `productDetails` (a new `RequestHelper`) was added to build requests on details pages, and accounts for a specified collection and area.
  - Collection and area are specified by history state (set by parsing of optional collection and area query string parameters).

## [1.71.0] - 2019-02-04

### Added
- SF-1276: Added support for `siteParams` in search, detail, and pastPurchases.
  - Add the following store Selectors:
    - `siteParams` - returns Search siteParams.
    - `detailsTemplate`, `detailsSiteParams` - returns details template and siteParams, respectively.
    - `pastPurchaseTemplate`, `pastPurchaseSiteParams` - returns past purchase template and siteParams, respectively.


## [1.70.0] - 2019-01-24
### Changed
- SF-1256: Updated `selectSort` and `selectPastPurchasesSort` action creators:
  - Payloads that include the `selected` index are now valid.
- SF-1256: Persisted sort and past purchase sort labels in the application store.
- SF-1256: Updated `search` and `pastPurchases` sort configurations to support labels.
  - To apply sort labels via the `search` sort configuration:

  ```js
  ...
  search: {
    sort: {
      options: [
        { field: 'foo', descending: true },
        { field: 'foo', descending: false },
        { field: 'bar' },
      ],
      labels: [
        'Foo | Descending',
        'Foo | Ascending',
        'Bar',
      ],
    },
    ...
  },
  ...
  ```

  - To apply sort labels via the `pastPurchases` sort configuration:

  ```js
  ...
  recommendations: {
    ...
    pastPurchases: {
      ...
      sort: {
        options: [
          { field: 'foo', descending: true },
          { field: 'foo', descending: false },
          { field: 'bar' },
        ],
        labels: [
          'Foo | Descending',
          'Foo | Ascending',
          'Bar',
        ],
      },
      ...
    },
    ...
  },
  ...
  ```

### Added
- SF-1256: Added `applySorts()` and `applyPastPurchaseSorts()` action creators.
- SF-1256: Added support for the following sort-related events:
  - `SORTS_ITEMS_UPDATED` - Emitted when the sort items are updated.
  - `SORTS_LABELS_UPDATED` - Emitted when the sort labels are updated.
  - `SORTS_SELECTED_UPDATED` - Emitted when the selected sort is updated.
- SF-1256: Added support for the following past purchase sort-related events:
  - `PAST_PURCHASE_SORT_ITEMS_UPDATED` - Emitted when the past purchase sort items are updated.
  - `PAST_PURCHASE_SORT_LABELS_UPDATED` - Emitted when the past purchase sort labels are updated.
  - `PAST_PURCHASE_SORT_SELECTED_UPDATED` - Emitted when the selected past purchase sort is updated.

## [1.69.1] - 2019-01-23
### Changed
- SF-1267: Refinements calls now use the search overrides if a refinements override is not given.

## [1.69.0] - 2019-01-16
### Added
- SF-1185: Make a history store
  - `initHistory`, `pushState`, `updateHistory`, and `refreshState` methods added on `flux`.
  - `updateHistory` action creator that triggers history `pushState` and `replaceState`, and updates the `history` section in the store.
  - `data.present.history` store section was created:
    - eg,
      ```js
        history: {
          request: {...},
          route: '...',
          url: '...',
          shouldFetch: true,
        }
      ```
    - Associated selectors: `history`, `url`, `route`, `urlRequest`.
    - Associated events: `URL_UPDATED`, `ROUTE_UPDATED`, `SEARCH_URL_UPDATED`, `DETAILS_URL_UPDATED`, `PAST_PURCHASE_URL_UPDATED`, `CUSTOM_URL_UPDATED`.

## [1.68.0] - 2019-01-14
### Added
- SF-1073: Created new `selectMultipleRefinements` and `selectMultiplePastPurchaseRefinements` actions.
  - Users can now select multiple refinements at a given time by passing in a `navigationId` and an array of indices to these new actions.

## [1.67.4] - 2019-01-07
### Added
- SF-1237: Exposed past purchase sort options via importable `PAST_PURCHASE_SORTS` object.
  - `PAST_PURCHASE_SORTS` exposes:
    - `DEFAULT` - Sorts past purchases based on the past purchase endpoint.
    - `MOST_PURCHASED` - Sorts past purchases based on the quantity purchased.
    - `MOST_RECENT` - Sorts past purchases based on the latest purchased timestamp.
- SF-1237: Added support for configuring past purchase sort options.
  ```
  {
  ...
    recommendations: {
      pastPurchases: {
        sort: {
          options: [{ field: PAST_PURCHASE_SORTS.MOST_RECENT, descending: true }, { field: PAST_PURHCASE_SORTS. MOST_PURCHASED, descending: true }],
          default: { field: PAST_PURCHASE_SORTS.MOST_RECENT, descending: true }
      }
    }
  }
  ...
  ```

### Fixed
- SF-1237: Fix issue where past purchase sorts are not correctly applied/transmitted.

## [1.67.3] - 2019-01-04
### Fixed
- SF-1243: `updateQuery` action sets `original` query and clears the rest of query state.

## [1.67.2] - 2019-01-04
### Fixed
- SF-1243: Remove unnecessary default values in query reducer.

## [1.67.1] - 2019-01-02
### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.67.0] - 2018-12-19
### Changed
- SF-1230: Add support for fetching more past purchase refinements.
  - Implementations can now fetch and ingest additional refinements for past purchase-type navigations.

## [1.66.0] - 2018-12-04
### Added
- SF-1196: Added support for `toggle` type navigations.
  - The result is that `toggle` type navigations generate refinement crumbs that display the navigation name.
  - `toggle` type navigations can be specified under the new top-level configuration object `navigations`.

## [1.65.1] - 2018-11-27
### Changed
- SF-1199: Update `groupby-api` version to `2.5.7`.

## [1.65.0] - 2018-11-26
### Changed
- SF-1192: Update `fetchProductDetails` action to include redirect parameter.
  - Set `search` property of `isFetching` state slice within the store to `false` when a single result redirect is triggered.

### Added
- SF-1192: Create `isFetching` selector
  - Selector is needed in order to retrieve `isFetching` portion of the store.

## [1.64.0] - 2018-11-26
### Added
- SF-1170: Update `FluxCapacitor` class to expose `all()` and `allOff()` instance methods.
  - `all()` invokes a callback after each event in a given collection has been emitted at least once.
  - `allOff()` removes a callback associated with a given collection of events.

## [1.63.1] - 2018-11-07
### Fixed
- SF-1167: Call `replaceState` at the end of the details request.
  - Don't call `replaceState` in the products saga before the `fetchProductDetails` action on a single results redirect page

## [1.63.0] - 2018-10-26
### Added
- SF-1146: Add pastPurchases and recommendations overrides.
  - Overrides accept either an object or function, like all the other overrides.
