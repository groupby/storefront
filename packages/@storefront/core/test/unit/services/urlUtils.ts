import { Adapters, Events, Selectors } from '@storefront/flux-capacitor';
import * as sinon from 'sinon';
import CoreSelectors from '../../../src/core/selectors';
import { BaseService, CORE } from '../../../src/core/service';
import * as UrlBeautifier from '../../../src/core/url-beautifier';
import * as CoreUtils from '../../../src/core/utils';
import Utils from '../../../src/services/urlUtils';
import suite from './_suite';

suite('URL Service', ({ expect, spy, stub }) => {
  let win;

  beforeEach(() => {
    win = { addEventListener: spy() };
    stub(CoreUtils, 'WINDOW').returns(win);
  });

  describe('static', () => {
    describe('getBaseUri', () => {
      it('should return the base URI', () => {
        win.document = { baseURI: 'foo' };

        expect(Utils.getBaseUri()).to.eq('foo');
      });

      it('should extract the `href` property from the <base> element', () => {
        win.document = {
          querySelector: stub().withArgs('base').returns({ href: 'bar' }),
        };

        expect(Utils.getBaseUri()).to.eq('bar');
      });

      it('should fall back to the current location', () => {
        const querySelector = spy(() => null);
        win.location = { href: 'baz' };
        win.document = { querySelector };

        expect(Utils.getBaseUri()).to.eq('baz');
        expect(querySelector).to.be.called;
      });
    });

    describe('getBasePath()', () => {
      it('should get base URL path', () => {
        const baseURI = 'http://example.com/base/path';
        win.document = { baseURI };
        win.location = { pathname: '/not/base/path' };

        expect(Utils.getBasePath()).to.eq('/base/path');
      });

      it('should return the empty string for no defined base tag', () => {
        const pathname = '/base/path';
        const baseURI = `http://example.com${pathname}`;
        win.document = { baseURI };
        win.location = { pathname };

        expect(Utils.getBasePath()).to.eq('');
      });

      it('should strip trailing slashes', () => {
        const baseURI = 'http://example.com/base/path/';
        win.document = { baseURI };
        win.location = { pathname: '/not/base/path' };

        expect(Utils.getBasePath()).to.eq('/base/path');
      });
    });

    describe('searchUrlState()', () => {
      it('should return search url state', () => {
        const state: any = { a: 'b' };
        const query = 'hi';
        const page = 2;
        const pageSize = 30;
        const refinements = [
          { type: 'Value', navigationName: 'first', value: 'one' },
          { type: 'Range', navigationName: 'second', low: 1, high: 2 }
        ];
        const sort = { c: 'd' };
        const collection = 'a collection';
        stub(Selectors, 'query').withArgs(state).returns(query);
        stub(Selectors, 'page').withArgs(state).returns(page);
        stub(Selectors, 'pageSize').withArgs(state).returns(pageSize);
        stub(Selectors, 'selectedRefinements').withArgs(state).returns(refinements);
        stub(Selectors, 'sort').withArgs(state).returns(sort);
        stub(Selectors, 'collection').withArgs(state).returns(collection);

        expect(Utils.searchUrlState(state)).to.eql({
          query,
          page,
          pageSize,
          refinements: [
            { field: 'first', value: 'one' },
            { field: 'second', low: 1, high: 2 }
          ],
          sort,
          collection
        });
      });
    });

    describe('detailsUrlState()', () => {
      it('should return details url state', () => {
        const state: any = 'state';
        const ret = { data: 'dat' };
        const details = stub(CoreSelectors, 'transformedDetailsProduct').returns(ret);
        expect(Utils.detailsUrlState(state)).to.eql({
          data: ret.data,
          variants: [],
        });
        expect(details).to.be.calledWithExactly(state);
      });
    });

    describe('navigationUrlState()', () => {
      it('should return navigation url state', () => {
        const state: any = 'state';
        expect(Utils.navigationUrlState(state)).to.eql({});
      });
    });

    describe('pastPurchaseUrlState()', () => {
      it('should return pastPurchase url state', () => {
        const state: any = 'state';
        const sorts = { selected: 1, items: ['a', 'b', 'c'] };
        const query = 'q';
        const page = 'p';
        const pageSize = 's';
        const selected = [
          { navigationName: 'f', value: 'c', type: 'Value' },
          { navigationName: 'r', value: 'j', type: 'Value' },
        ];
        const refinements = [{ field: 'f', value: 'c' }, { field: 'r', value: 'j' }];
        const pastPurchaseSort = stub(Selectors, 'pastPurchaseSort').returns(sorts);
        const pastPurchaseQuery = stub(Selectors, 'pastPurchaseQuery').returns(query);
        const pastPurchasePage = stub(Selectors, 'pastPurchasePage').returns(page);
        const pastPurchasePageSize = stub(Selectors, 'pastPurchasePageSize').returns(pageSize);
        const pastPurchaseSelectedRefinements = stub(Selectors, 'pastPurchaseSelectedRefinements').returns(selected);
        expect(Utils.pastPurchaseUrlState(state)).to.eql({
          query,
          page,
          pageSize,
          sort: sorts.items[sorts.selected],
          refinements,
          collection: null,
        });
        expect(pastPurchaseSort).to.be.calledWithExactly(state);
        expect(pastPurchaseQuery).to.be.calledWithExactly(state);
        expect(pastPurchasePage).to.be.calledWithExactly(state);
        expect(pastPurchasePageSize).to.be.calledWithExactly(state);
        expect(pastPurchaseSelectedRefinements).to.be.calledWithExactly(state);
      });
    });

    describe('stateToBaseRequest', () => {
      let collection;
      let refinements;
      let sort;

      beforeEach(() => {
        collection = 'a collection';
        refinements = [1,2,3,4,5];
        sort = { a: 'b' };
      });

      it('should configure a base request using the state', () => {
        const state: any = {
          collection,
          refinements,
          sort,
          a: 'b',
        };
        const store: any = {};
        stub(Adapters.Request, 'extractRefinement').returnsArg(1);
        stub(Adapters.Request, 'extractSort').withArgs(sort).returns(sort);

        expect(Utils.stateToBaseRequest(state, store)).to.eql({
          collection,
          refinements,
          sort,
          a: 'b',
        });
      });

      it('should configure a base request using the store', () => {
        const state: any = {};
        const store: any = { c: 'd' };
        stub(Selectors, 'collection').withArgs(store).returns(collection);

        expect(Utils.stateToBaseRequest(state, store)).to.eql({
          collection,
        });
      });
    });

    describe('searchStateToRequest()', () => {
      let collection;
      let page;
      let pageSize;
      let query;
      let refinements;
      let skip;
      let sort;

      beforeEach(() => {
        collection = 'a collection';
        page = 324;
        pageSize = 25;
        query = 'dress';
        refinements = [1,2,3,4,5];
        skip = 30;
        sort = { a: 'b' };
      });

      it('should return search request based off given state', () => {
        const state: any = {
          collection,
          page,
          pageSize,
          query,
          refinements,
          sort,
        };
        const store: any = { c: 'd' };
        stub(Adapters.Request, 'extractRefinement').returnsArg(1);
        stub(Adapters.Request, 'extractSkip').withArgs(page).returns(skip);
        stub(Adapters.Request, 'extractSort').withArgs(sort).returns(sort);

        expect(Utils.searchStateToRequest(state, store)).to.eql({
          pageSize,
          skip,
          collection,
          query,
          refinements,
          sort,
        });
      });

      it('should return search request based off store', () => {
        const state: any = {};
        const store: any = { c: 'd' };
        stub(Selectors, 'pageSize').withArgs(store).returns(pageSize);
        stub(Adapters.Request, 'clampPageSize').withArgs(1, pageSize).returns(pageSize);
        stub(Selectors, 'collection').withArgs(store).returns(collection);
        stub(Selectors, 'currentQuery').withArgs(store).returns(query);
        stub(Adapters.Request, 'extractSkip').withArgs(1).returns(skip);
        stub(Selectors, 'sort').withArgs(store).returns(sort);
        stub(Adapters.Request, 'extractSort').withArgs(sort).returns(sort);

        expect(Utils.searchStateToRequest(state, store)).to.eql({
          pageSize,
          skip,
          collection,
          query,
          sort,
        });
      });

      it('should omit properties which cannot be extracted from the state or store', () => {
        const state: any = {};
        const store: any = {};
        stub(Selectors, 'pageSize').returns(null);
        stub(Selectors, 'collection').withArgs(store).returns(collection);
        stub(Selectors, 'currentQuery').withArgs(store).returns(query);
        stub(Selectors, 'sort').withArgs(store).returns(null);

        expect(Utils.searchStateToRequest(state, store)).to.eql({
          collection,
          query,
        });
      });
    });

    describe('pastPurchaseStateToRequest()', () => {
      let collection;
      let page;
      let pageSize;
      let query;
      let refinements;
      let skip;
      let sort;

      beforeEach(() => {
        collection = 'a collection';
        page = 324;
        pageSize = 25;
        query = 'dress';
        refinements = [1,2,3,4,5];
        skip = 30;
        sort = { a: 'b' };
      });

      it('should return past purchase request based off given state', () => {
        const state: any = {
          collection,
          page,
          pageSize,
          query,
          refinements,
        };
        const store: any = { c: 'd' };
        stub(Adapters.Request, 'clampPageSize').withArgs(page, pageSize).returns(pageSize);
        stub(Adapters.Request, 'extractRefinement').returnsArg(1);
        stub(Adapters.Request, 'extractSkip').withArgs(page).returns(skip);

        expect(Utils.pastPurchaseStateToRequest(state, store)).to.eql({
          pageSize,
          skip,
          collection,
          query,
          refinements,
        });
      });

      it('should return past purchase request based off store', () => {
        const state: any = {};
        const store: any = { c: 'd' };
        stub(Selectors, 'pastPurchasePageSize').withArgs(store).returns(pageSize);
        stub(Adapters.Request, 'clampPageSize').withArgs(1, pageSize).returns(pageSize);
        stub(Selectors, 'collection').withArgs(store).returns(collection);
        stub(Selectors, 'pastPurchaseQuery').withArgs(store).returns(query);
        stub(Adapters.Request, 'extractSkip').withArgs(1).returns(skip);

        expect(Utils.pastPurchaseStateToRequest(state, store)).to.eql({
          pageSize,
          skip,
          collection,
          query,
        });
      });

      it('should omit properties which cannot be extracted from the state or store', () => {
        const state: any = {};
        const store: any = {};
        stub(Selectors, 'pastPurchasePageSize').withArgs(store).returns(null);
        stub(Selectors, 'collection').withArgs(store).returns(collection);
        stub(Selectors, 'pastPurchaseQuery').withArgs(store).returns(query);
        stub(Selectors, 'pastPurchaseSortSelected').withArgs(store).returns(null);

        expect(Utils.pastPurchaseStateToRequest(state, store)).to.eql({
          collection,
          query,
        });
      });

      it('should remove the `sort` property from state', () => {
        const state: any = {
          collection,
          page,
          pageSize,
          query,
          skip,
          sort,
        };
        const store: any = {};
        stub(Adapters.Request, 'clampPageSize').withArgs(page, pageSize).returns(pageSize);
        stub(Adapters.Request, 'extractSkip').withArgs(page).returns(skip);

        expect(Utils.pastPurchaseStateToRequest(state, store)).to.eql({
          collection,
          pageSize,
          query,
          skip,
        });
      });
    });

    describe('getAllIds()', () => {
      it('should add unique request refinements to state allIds', () => {
        const state: any = {
          allIds: ['a', 'b', 'c'],
        };
        const request = { refinements: [{ field: 'd' }, { field: 'b' }, { field: 'e' }] };

        expect(Utils.getAllIds(state, request)).to.eql([...state.allIds, 'd', 'e']);
      });

      it('should return state allIds when no request refinements exist', () => {
        const state: any = {
          allIds: ['a', 'b', 'c'],
        };

        expect(Utils.getAllIds(state, {})).to.eql(state.allIds);
      });
    });

    describe('getById()', () => {
      it('should add refinements to state byId', () => {
        const state: any = {
          byId: {
            d: {
              range: false,
              refinements: [{ value: 'ok' }],
              selected: [],
            },
            b: {
              range: true,
              refinements: [],
              selected: [],
            }
          },
        };
        const request = {
          refinements: [
            { field: 'd', value: 'ok', type: 'Value' },
            { field: 'b', low: 0, high: 10, type: 'Range' },
            { field: 'e', value: 'hm', type: 'Value' }
          ]
        };

        expect(Utils.getById(state, request)).to.eql({
          d: {
            range: false,
            refinements: [{ value: 'ok' }],
            selected: [0],
          },
          b: {
            range: true,
            refinements: [{ low: 0, high: 10 }],
            selected: [0],
          },
          e: {
            field: 'e',
            label: 'e',
            range: false,
            refinements: [{ value: 'hm' }],
            selected: [0],
          }
        });
      });
    });

    describe('mergePastPurchaseState()', () => {
      it('should merge state properly when given new request', () => {
        const state: any = {
          data: {
            present: {
              other: {},
              pastPurchases: {
                query: { c: 'd' },
                page: { e: 'f', sizes: { g: 'h', items: [10, 20, 50], selected: 0 } },
                navigations: {
                  allIds: ['brand', 'somethingElse'],
                  byId: {
                    brand: {
                      field: 'brand',
                      label: 'brand',
                      range: false,
                      refinements: [{ value: 'adidas' }],
                      selected: [0]
                    },
                    somethingElse: {
                      field: 'somethingElse',
                      label: 'somethingElse',
                      range: false,
                      refinements: [{ value: 'ok' }],
                      selected: [0]
                    }
                  }
                },
                sort: {
                  items: [{ field: 'price' }, { field: 'price', descending: true }],
                  selected: 0,
                },
              },
            },
          },
        };
        const request: any = {
          page: 14,
          pageSize: 20,
          query: 'grape ape',
          refinements: [
            { type: 'Value', field: 'brand', value: 'nike' },
            { type: 'Value', field: 'brand', value: 'adidas' },
            { type: 'Value', field: 'colour', value: 'orange' },
            { type: 'Range', field: 'price', low: 20, high: 40 },
          ],
          sort: { field: 'price', descending: true },
        };
        const searchId = 12;

        const newState = Utils.mergePastPurchaseState(state, request);

        expect(newState).to.eql({
          data: {
            present: {
              other: {},
              pastPurchases: {
                query: 'grape ape',
                page: {
                  e: 'f',
                  current: 14,
                  sizes: { g: 'h', items: [10, 20, 50], selected: 1 },
                },
                navigations: {
                  allIds: ['brand', 'somethingElse', 'colour', 'price'],
                  byId: {
                    brand: {
                      field: 'brand',
                      label: 'brand',
                      range: false,
                      refinements: [{ value: 'adidas' }, { value: 'nike' }],
                      selected: [0, 1]
                    },
                    somethingElse: {
                      field: 'somethingElse',
                      label: 'somethingElse',
                      range: false,
                      refinements: [{ value: 'ok' }],
                      selected: [0]
                    },
                    colour: {
                      field: 'colour',
                      label: 'colour',
                      range: false,
                      refinements: [{ value: 'orange' }],
                      selected: [0]
                    },
                    price: {
                      field: 'price',
                      label: 'price',
                      range: true,
                      refinements: [{ high: 40, low: 20 }],
                      selected: [0]
                    }
                  }
                },
                sort: { items: [{ field: 'price' }, { field: 'price', descending: true }], selected: 1 },
              },
            },
          },
        });
      });

      it('should merge state properly when not given new request', () => {
        const searchId = 13;
        const state: any = {
          session: {
            searchId,
          },
          data: {
            present: {
              a: 'b',
              pastPurchases: {
                query: { c: 'd', original: 'whatever' },
                page: { e: 'f', sizes: { g: 'h', items: [10, 20, 50], selected: 0 }, current: 10 },
                navigations: { i: 'j', allIds: ['brand', 'format'], byId: { brand: {}, format: {} } },
                sort: {
                  items: [{ field: 'price' }, { field: 'price', descending: true }],
                  selected: 0,
                },
              },
              collections: { selected: 0 },
            },
          },
        };
        const request: any = { refinements: [] };

        const newState = Utils.mergePastPurchaseState(state, request);

        expect(newState).to.eql(state);
      });
    });

    describe('mergeSearchState()', () => {
      it('should merge state properly when given new request', () => {
        const state: any = {
          data: {
            present: {
              a: 'b',
              query: { c: 'd' },
              page: { e: 'f', sizes: { g: 'h', items: [10, 20, 50], selected: 0 } },
              navigations: {
                allIds: ['brand', 'price'],
                byId: {
                  brand: {
                    field: 'brand',
                    label: 'brand',
                    range: false,
                    refinements: [{ value: 'nike' }],
                    selected: [0]
                  },
                  price: {
                    field: 'price',
                    label: 'price',
                    range: true,
                    refinements: [{ high: 10, low: 0 }, { high: 40, low: 20 }],
                    selected: []
                  }
                }
              },
              sorts: {
                items: [{ field: 'price' }, { field: 'price', descending: true }],
                selected: 0,
              },
              collections: { selected: 0 },
            },
          },
        };
        const request: any = {
          page: 14,
          pageSize: 20,
          query: 'grape ape',
          refinements: [
            { type: 'Value', field: 'brand', value: 'nike' },
            { type: 'Value', field: 'colour', value: 'orange' },
            { type: 'Range', field: 'price', low: 20, high: 40 },
          ],
          sort: { field: 'price', descending: true },
        };
        const searchId = 12;

        const newState = Utils.mergeSearchState(state, request);

        expect(newState).to.eql({
          data: {
            present: {
              a: 'b',
              query: {
                c: 'd',
                original: 'grape ape',
              },
              page: {
                e: 'f',
                current: 14,
                sizes: { g: 'h', items: [10, 20, 50], selected: 1 },
              },
              navigations: {
                allIds: ['brand', 'price', 'colour'],
                byId: {
                  brand: {
                    field: 'brand',
                    label: 'brand',
                    range: false,
                    refinements: [{ value: 'nike' }],
                    selected: [0],
                  },
                  price: {
                    field: 'price',
                    label: 'price',
                    range: true,
                    refinements: [{ high: 10, low: 0 }, { low: 20, high: 40 }],
                    selected: [1],
                  },
                  colour: {
                    field: 'colour',
                    label: 'colour',
                    range: false,
                    refinements: [{ value: 'orange' }],
                    selected: [0],
                  },
                },
              },
              sorts: { items: [{ field: 'price' }, { field: 'price', descending: true }], selected: 1 },
              collections: { selected: 0 },
            },
          },
        });
      });

      it('should merge state properly when not given new request', () => {
        const searchId = 13;
        const state: any = {
          session: {
            searchId,
          },
          data: {
            present: {
              a: 'b',
              query: { c: 'd', original: 'whatever' },
              page: { e: 'f', sizes: { g: 'h', items: [10, 20, 50], selected: 0 }, current: 10 },
              navigations: { i: 'j', allIds: ['brand', 'format'], byId: { brand: {}, format: {} } },
              sorts: {
                items: [{ field: 'price' }, { field: 'price', descending: true }],
                selected: 0,
              },
              collections: { selected: 0 },
            },
          },
        };
        const request: any = { refinements: [] };

        const newState = Utils.mergeSearchState(state, request);

        expect(newState).to.eql(state);
      });
    });

    describe('mergePastPurchaseSortsState()', () => {
      it('should call `mergeSortsState()` with `Selectors.pastPurchaseSort`', () => {
        const pastPurchaseSort = { foo: 'bar' };
        const request = { baz: 'quux' };
        const mergeSortsStateStub = stub(Utils, 'mergeSortsState');
        stub(Selectors, 'pastPurchaseSort').returns(pastPurchaseSort);

        Utils.mergePastPurchaseSortsState(<any>{}, <any>request);

        expect(mergeSortsStateStub).to.be.calledWith(pastPurchaseSort, request);
      });
    });

    describe('mergeSearchSortsState()', () => {
      it('should call `mergeSortsState()` with `Selectors.sorts`', () => {
        const sort = { foo: 'bar' };
        const request = { baz: 'quux' };
        const mergeSortsStateStub = stub(Utils, 'mergeSortsState');
        stub(Selectors, 'sorts').returns(sort);

        Utils.mergeSearchSortsState(<any>{}, <any>request);

        expect(mergeSortsStateStub).to.be.calledWith(sort, request);
      });
    });

    describe('mergeSortsState()', () => {
      it('should spread the `sorts`', () => {
        const request = { sort: {} };
        const sorts = {
          items: [],
          selected: 0,
        };

        const result = Utils.mergeSortsState(sorts, <any>request);

        expect(result).to.include(sorts);
      });

      it('should update the selected sort', () => {
        const item1 = { field: 'foo', descending: false };
        const item2 = { field: 'bar', descending: false };
        const request = { sort: item2 };
        const sorts = {
          items: [item1, item2],
          selected: 0,
        };

        const result = Utils.mergeSortsState(sorts, <any>request);

        expect(result).to.eql({
          items: [item1, item2],
          selected: 1,
        });
      });

      it('should not update the selected sort if the index is not found', () => {
        const request = { sort: { field: 'Missing Field' } };
        const sorts = {
          items: [{ field: 'foo' }, { field: 'bar' }],
          selected: 1,
        };

        const result = Utils.mergeSortsState(sorts, <any>request);

        expect(result).to.eql(sorts);
      });
    });
  });
});
