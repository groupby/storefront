# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [minor]
### Changed
- Reverted v2.3.0.

## [2.3.0] - 2019-01-30 [YANKED]
A very old version was accidentally released as a new version. Do not use this version.

## [2.2.0] - 2019-01-24
### Changed
- Update `@storefront/flux-capacitor` to 1.70.0.

## [2.1.1] - 2019-01-23
### Changed
- Update `@storefront/flux-capacitor` to 1.69.1.

## [2.1.0] - 2019-01-18
### Added
- SF-948: Expose `debounce` utility function.
  - `debounce` may be used to decouple function invocation from execution.
  - `debounce` returns a new function, and may be used as follows:

  ```js
  import { utils } from '@storefront/core';

  const fn = (n) => n * n;
  const debouncedFn = utils.debounce(fn, 500);

  debouncedFn(3);
  ```

## [2.0.0] - 2019-01-16
### Changed
- Update `@storefront/flux-capacitor` to 1.69.0.
- SF-1185: Make a history store
  - Details, Search, and Past Purchase services all listen to new `URL_UPDATED` events and trigger requests.
  - Url service calls `initHistory` on `flux` with browser history functions.
  - **Breaking:** URL service no longer has many of the responsibilities it had before, and only sets up the history store and listens to `popstate`.
  - Alternate form of state history can be connected by initializing the history store with custom history `opts`.

## [1.56.1] - 2019-01-15
### Changed
- SF-1082: Update `filterState` to remove navigations, template, and a subset of autocomplete data when the history configuration is set to `length: 0`.
  - Removing application data reduces the chance that a history entry will exceed the maximum size for a given browser.

## [1.56.0] - 2019-01-14
### Changed
- Update `@storefront/flux-capacitor` to 1.68.0.

## [1.55.8] - 2019-01-14
### Added
- SF-1241: Expose table of DOM key strings.
  - This table may be used by StoreFront components and/or implementations which must respond to DOM events.
  - The contents of this table are as follow:

  ```js
  export const KEYS = {
    DOWN: 'ArrowDown',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    UP: 'ArrowUp',
    IE_DOWN: 'Down',
    IE_LEFT: 'Left',
    IE_RIGHT: 'Right',
    IE_UP: 'Up',
    IE_ESCAPE: 'Esc',
  };
  ```

## [1.55.7] - 2019-01-10
### Added
- SF-1163: Add hard-coded `GBI_METADATA` to the metadata of all tracking events.
  - `GBI_METADATA` indicates to our tracking service that an event is of GBI origin.
  - `GBI_METADATA` Objects:
    ```js
    [
      {
        key: 'gbi',
        value: 'true'
      },
      {
        key: 'gbi_experience',
        value: 'storefront'
      }
    ];
    ```
  - Note: Storefront will automatically add the above metadata objects and replace any existing metadata objects whose keys are `gbi` or `gbi_experience`.

## [1.55.6] - 2019-01-07
### Changed
- Update `@storefront/flux-capacitor` to 1.67.4.

### Fixed
- SF-1237: Fix issue where past purchase sorts are not correctly applied/transmitted.

## [1.55.5] - 2019-01-04
### Changed
- Update `@storefront/flux-capacitor` to 1.67.3.

## [1.55.4] - 2019-01-04
### Changed
- Update `@storefront/flux-capacitor` to 1.67.2.

## [1.55.3] - 2019-01-02
### Changed
- Update `@storefront/flux-capacitor` to 1.67.1.

### Fixed
- Update repository, issues, and homepage fields in `package.json` file.
  - All fields now point to monorepo, rather than package-specific repositories.

## [1.55.2] - 2019-01-02
### Added
- SF-1239: Set `maxRefinements` default to 20 in `search` configuration object.

## [1.55.1] - 2018-12-20
### Changed
- SF-1230: Change the default value for past purchase refinements from 30 to 20.

## [1.55.0] - 2018-12-19
### Changed
- Update `@storefront/flux-capacitor` to 1.67.0.

## [1.54.1] - 2018-12-07
### Fixed
- SF-1229: Use the `pastPurchaseSortSelected` selector to build up the `pastPurchase` request.

## [1.54.0] - 2018-12-04
### Changed
- Update `@storefront/flux-capacitor` to 1.66.0.

## [1.53.2] - 2018-12-03
### Fixed
- SF-1205: Add fallback for document.baseURI.
  - Prevents malformed routing tables when StoreFront is running in IE11.

## [1.53.1] - 2018-11-27
### Changed
- Update `@storefront/flux-capacitor` to 1.65.1.

## [1.53.0] - 2018-11-26
### Changed
- Update `@storefront/flux-capacitor` to 1.65.0.

## [1.52.0] - 2018-11-26
### Changed
- Update `@storefront/flux-capacitor` to 1.64.0.

### Added
- SF-1170: Add support for `subscribeWith()` method.
  - Allows components to invoke callbacks after each event in a given collection has been emitted at least once.
  - Automatically unregisters callbacks when the component is unmounted.

## [1.51.5] - 2018-11-14
### Fixed
- SF-1132: Default to an empty array for array methods and pass through the rest of the request.

## [1.51.4] - 2018-11-13
## Changed
- SF-1132: Make properties optional when parsing search state.

## [1.51.3] - 2018-11-08
### Changed
- SF-1181: Set `gb-tracker-client` in package.json to caret.

## [1.51.2] - 2018-11-08
### Fixed
- SF-1168: `mergeSearchNavigationsState` and `mergePastPurchaseNavigationsState` should merge url and store navigations

## [1.51.1] - 2018-11-07
### Changed
- Update `@storefront/flux-capacitor` to 1.63.1

### Fixed
- SF-1159: URL state not being preserved in the store.
  - `refreshState` from the url state when dispatching fetch requests.

## [1.51.0] - 2018-10-26
### Added
- SF-1146: Add pastPurchases and recommendations overrides defaults.

### Changed
- Upgrade `@storefront/flux-capacitor` to version 1.63.0.
