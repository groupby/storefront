import Adapter from '../../../../src/core/adapters/configuration';
import SearchAdapter from '../../../../src/core/adapters/search';
import { DEFAULT_AREA } from '../../../../src/core/reducers/data/area';
import { DEFAULT_COLLECTION } from '../../../../src/core/reducers/data/collections';
import * as PageReducer from '../../../../src/core/reducers/data/page';
import * as PastPurchaseReducer from '../../../../src/core/reducers/data/past-purchases';
import suite from '../../_suite';

suite('Configuration Adapter', ({ expect, stub }) => {

  describe('initialState()', () => {
    it('should return initialState based on defaults', () => {
      const category = 'cat';
      const sort = 'prices';
      const config = <any>{
        autocomplete: {
          category
        },
        search: {
          sort
        }
      };

      expect(Adapter.initialState(config)).to.eql({
        data: {
          present: {
            area: DEFAULT_AREA,
            autocomplete: {
              suggestions: [],
              navigations: [],
              products: [],
              category: {
                field: category,
                values: []
              },
              searchCharMinLimit: 1,
              showCategoryValuesForFirstMatch: false,
              template: {},
            },
            fields: [],
            collections: {
              selected: DEFAULT_COLLECTION,
              allIds: [DEFAULT_COLLECTION],
              byId: {
                [DEFAULT_COLLECTION]: {
                  name: DEFAULT_COLLECTION
                }
              }
            },
            sorts: {
              selected: 0,
              items: [sort]
            },
            page: {
              ...PageReducer.DEFAULTS,
              sizes: {
                selected: 0,
                items: [PageReducer.DEFAULT_PAGE_SIZE]
              }
            },
            pastPurchases: {
              ...PastPurchaseReducer.DEFAULTS,
              page: {
                ...PastPurchaseReducer.DEFAULTS.page,
                sizes: {
                  selected: 0,
                  items: [PastPurchaseReducer.DEFAULT_PAGE_SIZE]
                }
              }
            }
          }
        },
        session: {
          config
        }
      });
    });

    it('should return initialState based on config', () => {
      const area = 'test';
      const collection = {
        default: 'All the depts',
        options: ['All the depts', 'idk']
      };
      const category = 'whatevs';
      const fields = ['a', 'b', 'c'];
      const pageSize = {
        default: 50,
        options: [10, 20, 50]
      };
      const sort = {
        default: 'stuff',
        options: [{ field: 'stuff', descending: true }, { field: 'other stuff' }]
      };
      const config = <any>{
        area,
        collection,
        autocomplete: {
          category
        },
        search: {
          fields,
          pageSize,
          sort
        }
      };
      const state = {
        data: {
          present: {
            area,
            autocomplete: {
              suggestions: [],
              navigations: [],
              products: [],
              category: {
                field: category,
                values: []
              },
              searchCharMinLimit: 1,
              showCategoryValuesForFirstMatch: false,
              template: {},
            },
            fields,
            collections: {
              selected: collection.default,
              allIds: collection.options,
              byId: {
                [collection.options[0]]: {
                  name: collection.options[0]
                },
                [collection.options[1]]: {
                  name: collection.options[1]
                }
              }
            },
            sorts: {
              selected: 0,
              items: sort.options
            },
            page: {
              ...PageReducer.DEFAULTS,
              sizes: {
                selected: 2,
                items: pageSize.options
              }
            },
            pastPurchases: {
              ...PastPurchaseReducer.DEFAULTS,
              page: {
                ...PastPurchaseReducer.DEFAULTS.page,
                sizes: {
                  selected: 2,
                  items: pageSize.options
                }
              }
            }
          }
        },
        session: {
          config
        }
      };

      expect(Adapter.initialState(config)).to.eql(state);
    });
  });

  describe('extractCollection()', () => {
    it('should return default', () => {
      const defaultCollection = 'All';

      expect(Adapter.extractCollection(<any>{
        collection: {
          default: defaultCollection
        }
      })).to.eq(defaultCollection);
    });

    it('should return collection', () => {
      const collection = 'All';

      expect(Adapter.extractCollection(<any>{ collection })).to.eq(collection);
    });
  });

  describe('extractPageSizes()', () => {
    const defaultValue = 0;

    it('should do nothing if state is not an object', () => {
      const pageSizes = Adapter.extractPageSizes(<any>{
        search: {
          pageSize: false,
        }
      }, defaultValue);

      expect(pageSizes).to.eql({ selected: 0, items: [defaultValue] });
    });

    it('should default items to defaultValue', () => {
      const pageSizes = Adapter.extractPageSizes(<any>{
        search: {
          pageSize: {},
        }
      }, defaultValue);

      expect(pageSizes).to.eql({ selected: 0, items: [defaultValue] });
    });
  });

  describe('extractSorts()', () => {
    it('should do nothing if state does not contain default or options', () => {
      const sort = {};

      const sorts = Adapter.extractSorts(<any>{ search: { sort } });

      expect(sorts).to.eql({ selected: 0, items: [sort] });
    });

    it('should default selected to empty object', () => {
      const sorts = Adapter.extractSorts(<any>{
        search: {
          sort: {
            options: false,
          },
        }
      });

      expect(sorts).to.eql({ selected: 0, items: [] });
    });

    it('should return selected sorts', () => {
      const sort = {
        default: false,
        options: [
          {
            field: true,
            descending: true
          },
          {}
        ]
      };

      expect(Adapter.extractSorts(<any>{
        search: {
          sort
        }
      })).to.eql({ selected: 1, items: sort.options });
    });
  });

  describe('extractNavigationsPinned()', () => {
    it('should return pinned navigations', () => {
      const pinned = 'nav';

      expect(Adapter.extractNavigationsPinned(<any>{
        recommendations: {
          iNav: {
            navigations: {
              pinned
            }
          }
        }
      })).to.eq(pinned);
    });
  });

  describe('extractRefinementsPinned()', () => {
    it('should return pinned refinements', () => {
      const pinned = 'nav';

      expect(Adapter.extractRefinementsPinned(<any>{
        recommendations: {
          iNav: {
            refinements: {
              pinned
            }
          }
        }
      })).to.eq(pinned);
    });
  });

  describe('extractToggleNavigations()', () => {
    it('should return the toggle navigations', () => {
      const nav1 = 'nav1';
      const nav2 = 'nav2';
      const nav3 = 'nav3';

      const toggleNavs = Adapter.extractToggleNavigations(<any>{
        navigations: {
          type: {
            [nav1]: 'toggle',
            [nav2]: 'toggle',
            [nav3]: 'slider',
          }
        }
      });

      expect(toggleNavs.sort()).to.eql([nav1, nav2].sort());
    });
  });

  describe('extractIndexedState()', () => {
    it('should return indexed state', () => {
      const collectionDefault = 'Im a collection';

      expect(Adapter.extractIndexedState(<any>{ default: collectionDefault })).to.eql({
        selected: collectionDefault,
        allIds: [collectionDefault]
      });
    });
  });

  describe('extractLanguage()', () => {
    it('should return global language', () => {
      const language = 'en';

      expect(Adapter.extractLanguage(<any>{ language })).to.eq(language);
    });
  });

  describe('extractAutocompleteLanguage()', () => {
    it('should return autocomplete language', () => {
      const language = 'fr';

      expect(Adapter.extractAutocompleteLanguage(<any>{ autocomplete: { language } })).to.eq(language);
    });
  });

  describe('extractAutocompleteProductLanguage()', () => {
    it('should return autocomplete product language', () => {
      const language = 'fr';

      // tslint:disable-next-line max-line-length
      expect(Adapter.extractAutocompleteProductLanguage(<any>{ autocomplete: { products: { language } } })).to.eq(language);
    });
  });

  describe('extractAutocompleteArea()', () => {
    it('should return autocomplete area', () => {
      const area = 'myProductionArea';

      expect(Adapter.extractAutocompleteArea(<any>{ autocomplete: { area } })).to.eq(area);
    });
  });

  describe('extractAutocompleteProductArea()', () => {
    it('should return autocomplete product area', () => {
      const area = 'myProductionArea';

      expect(Adapter.extractAutocompleteProductArea(<any>{ autocomplete: { products: { area } } })).to.eq(area);
    });
  });

  describe('extractAutocompleteSuggestionCount()', () => {
    it('should return number of autocomplete suggestions to request', () => {
      const suggestionCount = 30;

      // tslint:disable-next-line max-line-length
      expect(Adapter.extractAutocompleteSuggestionCount(<any>{ autocomplete: { suggestionCount } })).to.eq(suggestionCount);
    });
  });

  describe('extractAutocompleteNavigationCount()', () => {
    it('should return number of autocomplete navigations to request', () => {
      const navigationCount = 14;

      // tslint:disable-next-line max-line-length
      expect(Adapter.extractAutocompleteNavigationCount(<any>{ autocomplete: { navigationCount } })).to.eq(navigationCount);
    });
  });

  describe('extractAutocompleteAutoFill()', () => {
    it('should return hoverAutoFill boolean', () => {
      const hoverAutoFill = true;

      // tslint:disable-next-line max-line-length
      expect(Adapter.extractAutocompleteHoverAutoFill(<any>{ autocomplete: { hoverAutoFill } })).to.eq(hoverAutoFill);
    });
  });

  describe('extractAutocompleteProductCount()', () => {
    it('should return number of autocomplete products to request', () => {
      const count = 23;

      expect(Adapter.extractAutocompleteProductCount(<any>{ autocomplete: { products: { count } } })).to.eq(count);
    });
  });

  describe('isAutocompleteAlphabeticallySorted()', () => {
    it('should return whether to sort autocomplete suggestions alphabetically', () => {
      expect(Adapter.isAutocompleteAlphabeticallySorted(<any>{ autocomplete: { alphabetical: true } })).to.be.true;
      expect(Adapter.isAutocompleteAlphabeticallySorted(<any>{ autocomplete: { alphabetical: false } })).to.be.false;
    });
  });

  describe('isAutocompleteMatchingFuzzily()', () => {
    it('should return whether to use fuzzy matching for autocomplete suggestions', () => {
      expect(Adapter.isAutocompleteMatchingFuzzily(<any>{ autocomplete: { fuzzy: true } })).to.be.true;
      expect(Adapter.isAutocompleteMatchingFuzzily(<any>{ autocomplete: { fuzzy: false } })).to.be.false;
    });
  });

  describe('extractAutocompleteNavigationLabels()', () => {
    it('should return the configured autocomplete navigation labels', () => {
      const labels = { a: 'b' };
      // tslint:disable-next-line max-line-length
      expect(Adapter.extractAutocompleteNavigationLabels(<any>{ autocomplete: { navigations: labels } })).to.eql(labels);
    });
  });

  describe('extractAutocompleteNavigationLabels()', () => {
    it('should return the configured autocomplete navigation labels', () => {
      const maxRefinements = 3;
      // tslint:disable-next-line max-line-length
      expect(Adapter.extractMaxRefinements(<any>{ search: { maxRefinements } })).to.eql(maxRefinements);
    });
  });

  describe('extractSecuredPayload', () => {
    it('should return securedPayload', () => {
      const securedPayload = { a: 1 };
      // tslint:disable-next-line max-line-length
      expect(Adapter.extractSecuredPayload(<any>{ recommendations: { pastPurchases: { securedPayload } } })).to.eql(securedPayload);
    });

    it('should handle securedPayload being a function', () => {
      const payload = { a: 1 };
      const securedPayload = stub().returns(payload);
      // tslint:disable-next-line max-line-length
      expect(Adapter.extractSecuredPayload(<any>{ recommendations: { pastPurchases: { securedPayload } } })).to.eql(payload);
      expect(securedPayload).to.be.calledOnce;
    });
  });

  describe('extractProductCount', () => {
    it('should return product count', () => {
      const productCount = 3;
      // tslint:disable-next-line max-line-length
      expect(Adapter.extractPastPurchaseProductCount(<any>{ recommendations: { pastPurchases: { productCount } } })).to.eql(productCount);
    });
  });

  describe('shouldAddPastPurchaseBias()', () => {
    it('should return true if requesting positive number of biases', () => {
      // tslint:disable-next-line max-line-length
      expect(Adapter.shouldAddPastPurchaseBias(<any>{ recommendations: { pastPurchases: { biasCount: 3 } } })).to.be.true;
    });

    it('should return false if requesting zero biases', () => {
      // tslint:disable-next-line max-line-length
      expect(Adapter.shouldAddPastPurchaseBias(<any>{ recommendations: { pastPurchases: { biasCount: 0 } } })).to.be.false;
    });
  });

  describe('isRealTimeBiasEnabled()', () => {
    it('should return config.personalization.realTimeBiasing casted to Boolean (truthy)', () => {
      // tslint:disable-next-line max-line-length
      expect(Adapter.isRealTimeBiasEnabled(<any>{ personalization: { realTimeBiasing: { attributes: {} } } })).to.be.true;
    });

    it('should return config.personalization.realTimeBiasing casted to Boolean (falsy)', () => {
      // tslint:disable-next-line max-line-length
      expect(Adapter.isRealTimeBiasEnabled(<any>{ personalization: { realTimeBiasing: { attributes: null } } })).to.be.false;
    });
  });

  describe('extractRealTimeBiasingExpiry()', () => {
    it('should return the expiry time for real time biasing', () => {
      const expiry = 3;
      // tslint:disable-next-line max-line-length
      expect(Adapter.extractRealTimeBiasingExpiry(<any>{ personalization: { realTimeBiasing: { expiry } } })).to.eq(expiry);
    });
  });

  describe('searchOverrides()', () => {
    it('should return the search overrides function', () => {
      const state: any = { search: { overrides: (r) => r } };

      expect(Adapter.searchOverrides(state)).to.eql(state.search.overrides);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { search: { overrides } };
      const o: any = { c: 'd' };

      expect(Adapter.searchOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        search: {
          overrides
        }
      };

      expect(Adapter.searchOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('autocompleteSuggestionsOverrides()', () => {
    it('should return the autocomplete suggestions overrides function', () => {
      const state: any = { autocomplete: { overrides: { suggestions: (r) => r } } };

      expect(Adapter.autocompleteSuggestionsOverrides(state)).to.eql(state.autocomplete.overrides.suggestions);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const suggestions: any = { a: 'b' };
      const state: any = { autocomplete: { overrides: { suggestions } } };
      const o: any = { c: 'd' };

      expect(Adapter.autocompleteSuggestionsOverrides(state)(o)).to.eql({ ...o, ...suggestions });
    });

    it('should return a normalized function', () => {
      const overrides = { c: 'd' };
      const config: any = {
        autocomplete: {
          overrides: {
            suggestions: overrides
          }
        }
      };

      expect(Adapter.autocompleteSuggestionsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('autocompleteProductsOverrides()', () => {
    it('should return the autocomplete products overrides function', () => {
      const state: any = { autocomplete: { overrides: { products: (r) => r } } };

      expect(Adapter.autocompleteProductsOverrides(state)).to.eq(state.autocomplete.overrides.products);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const products: any = { a: 'b' };
      const state: any = { autocomplete: { overrides: { products } } };
      const o: any = { c: 'd' };

      expect(Adapter.autocompleteProductsOverrides(state)(o)).to.eql({ ...o, ...products });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        autocomplete: {
          overrides: {
            products: overrides
          }
        }
      };

      expect(Adapter.autocompleteProductsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('collectionOverrides()', () => {
    it('should return the collections overrides function', () => {
      const state: any = { collections: { overrides: (r) => r } };

      expect(Adapter.collectionOverrides(state)).to.eq(state.collections.overrides);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { collections: { overrides } };
      const o: any = { c: 'd' };

      expect(Adapter.collectionOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        collections: {
          overrides
        }
      };

      expect(Adapter.collectionOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('detailsOverrides()', () => {
    it('should return the details overrides function', () => {
      const state: any = { details: { overrides: (r) => r } };

      expect(Adapter.detailsOverrides(state)).to.eq(state.details.overrides);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { details: { overrides } };
      const o: any = { c: 'd' };

      expect(Adapter.detailsOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        details: {
          overrides
        }
      };

      expect(Adapter.detailsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('refinementsOverrides', () => {
    it('should return the refinements overrides function', () => {
      const state: any = { refinements: { overrides: (r) => r } };

      expect(Adapter.refinementsOverrides(state)).to.eq(state.refinements.overrides);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { refinements: { overrides } };
      const o: any = { c: 'd' };

      expect(Adapter.refinementsOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        refinements: {
          overrides
        }
      };

      expect(Adapter.refinementsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('pastPurchaseAutocompleteOverrides', () => {
    it('should return the pastPurchases autocomplete overrides function', () => {
      const state: any = { recommendations: { pastPurchases: { overrides: { autocomplete: (r) => r } } } };

      expect(Adapter.pastPurchaseAutocompleteOverrides(state))
        .to.eq(state.recommendations.pastPurchases.overrides.autocomplete);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { recommendations: { pastPurchases: { overrides: { autocomplete: overrides } } } };
      const o: any = { c: 'd' };

      expect(Adapter.pastPurchaseAutocompleteOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        recommendations: {
          pastPurchases: {
            overrides: {
              autocomplete: overrides
            }
          }
        }
      };

      expect(Adapter.pastPurchaseAutocompleteOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('pastPurchaseOverrides', () => {
    it('should return the pastPurchases products overrides function', () => {
      const state: any = { recommendations: { pastPurchases: { overrides: { products: (r) => r } } } };

      expect(Adapter.pastPurchaseOverrides(state)).to.eq(state.recommendations.pastPurchases.overrides.products);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { recommendations: { pastPurchases: { overrides: { products: overrides } } } };
      const o: any = { c: 'd' };

      expect(Adapter.pastPurchaseOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        recommendations: {
          pastPurchases: {
            overrides: {
              products: overrides
            }
          }
        }
      };

      expect(Adapter.pastPurchaseOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('recommendationsNavigationsOverrides', () => {
    it('should return the recommendations navigations overrides function', () => {
      const state: any = { recommendations: { overrides: { navigations: (r) => r } } };

      expect(Adapter.recommendationsNavigationsOverrides(state))
        .to.eq(state.recommendations.overrides.navigations);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { recommendations: { overrides: { navigations: overrides } } };
      const o: any = { c: 'd' };

      expect(Adapter.recommendationsNavigationsOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        recommendations: {
          overrides: {
            navigations: overrides
          }
        }
      };

      expect(Adapter.recommendationsNavigationsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('recommendationsIdsOverrides', () => {
    it('should return the recommendations ids overrides function', () => {
      const state: any = { recommendations: { overrides: { ids: (r) => r } } };

      expect(Adapter.recommendationsIdsOverrides(state))
        .to.eq(state.recommendations.overrides.ids);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { recommendations: { overrides: { ids: overrides } } };
      const o: any = { c: 'd' };

      expect(Adapter.recommendationsIdsOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        recommendations: {
          overrides: {
            ids: overrides
          }
        }
      };

      expect(Adapter.recommendationsIdsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('recommendationsProductsOverrides', () => {
    it('should return the recommendations products overrides function', () => {
      const state: any = { recommendations: { overrides: { products: (r) => r } } };

      expect(Adapter.recommendationsProductsOverrides(state))
        .to.eq(state.recommendations.overrides.products);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { recommendations: { overrides: { products: overrides } } };
      const o: any = { c: 'd' };

      expect(Adapter.recommendationsProductsOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        recommendations: {
          overrides: {
            products: overrides
          }
        }
      };

      expect(Adapter.recommendationsProductsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });

  describe('recommendationsSuggestionsOverrides', () => {
    it('should return the recommendations autocompleteSuggestions overrides function', () => {
      const state: any = { recommendations: { overrides: { autocompleteSuggestions: (r) => r } } };

      expect(Adapter.recommendationsSuggestionsOverrides(state))
        .to.eq(state.recommendations.overrides.autocompleteSuggestions);
    });

    it('should return a function that mixes in the overrides with a given object', () => {
      const overrides: any = { a: 'b' };
      const state: any = { recommendations: { overrides: { autocompleteSuggestions: overrides } } };
      const o: any = { c: 'd' };

      expect(Adapter.recommendationsSuggestionsOverrides(state)(o)).to.eql({ ...o, ...overrides });
    });

    it('should return a normalized function', () => {
      const overrides = { a: 'b' };
      const config: any = {
        recommendations: {
          overrides: {
            autocompleteSuggestions: overrides
          }
        }
      };

      expect(Adapter.recommendationsSuggestionsOverrides(config)(<any>{})).to.eql(overrides);
    });
  });
});
