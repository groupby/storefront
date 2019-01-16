import * as effects from 'redux-saga/effects';
import Actions from '../../../../src/core/actions';
import RecommendationsAdapter from '../../../../src/core/adapters/recommendations';
import SearchAdapter from '../../../../src/core/adapters/search';
import Events from '../../../../src/core/events';
import { productsRequest, recommendationsNavigationsRequest } from '../../../../src/core/requests';
import sagaCreator, { ProductsTasks } from '../../../../src/core/sagas/products';
import Requests from '../../../../src/core/sagas/requests';
import Selectors from '../../../../src/core/selectors';
import * as utils from '../../../../src/core/utils';
import suite from '../../_suite';

suite('products saga', ({ sinon, expect, spy, stub }) => {
  const iNavDefaults = {
    navigations: {
      sort: false
    },
    refinements: {
      sort: false
    },
    minSize: 15,
    size: 10,
    window: 'day',
  };

  describe('createSaga()', () => {
    it('should return a saga', () => {
      const flux: any = { a: 'b' };

      const saga = sagaCreator(flux)();

      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_PRODUCTS, ProductsTasks.fetchProducts, flux, false));
      // tslint:disable-next-line max-line-length
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_PRODUCTS_WITHOUT_HISTORY, ProductsTasks.fetchProducts, flux, true));
      // tslint:disable-next-line max-line-length
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_PRODUCTS_WHEN_HYDRATED, ProductsTasks.fetchProductsWhenHydrated, flux));
      expect(saga.next().value).to.eql(effects.takeEvery(Actions.FETCH_MORE_PRODUCTS, ProductsTasks.fetchMoreProducts, flux));
      saga.next();
    });
  });

  describe('Tasks', () => {
    describe('fetchProducts()', () => {
      const singleRefinement = [{ value: 'test1', type: 'Value', count: 2 },
      { value: 'test3', type: 'Value', count: 4 },
      { value: 'test8', type: 'Value', count: 8 }];
      const availableNavigation: any = [
        { name: 'cat1', refinements: singleRefinement },
        { name: 'cat0', refinements: singleRefinement },
        { name: 'cat-1', refinements: singleRefinement },
        { name: 'other', refinements: singleRefinement },
      ];

      it('should handle error', () => {
        const receiveProductsAction: any = 'test';
        const receiveProducts = spy(() => receiveProductsAction);
        const flux: any = {
          actions: {
            receiveProducts
          }
        };
        const task = ProductsTasks.fetchProducts(flux, false, <any>{});
        const error = new Error();
        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveProductsAction));
        expect(receiveProducts).to.be.calledWith(error);
        task.next();
      });

      it('should fetch products and navigations', () => {
        const id = '1459';
        const config: any = {
          recommendations: { iNav: iNavDefaults },
          search: { redirectSingleResult: false }
        };
        const emit = spy();
        const replaceState = spy();
        const search = () => null;
        const bridge = { search };
        const payload = { a: 'b', buildAndParse: true };
        const action: any = { payload };
        const receiveProductsAction: any = { c: 'd' };
        const receiveNavigationsAction: any = { e: 'f' };
        const request = { e: 'f' };
        const response = { id, totalRecordCount: 3, availableNavigation: [] };
        const receiveProducts = spy(() => receiveProductsAction);
        const receiveNavigationSort = spy(() => receiveNavigationsAction);
        // tslint:disable-next-line max-line-length
        const flux: any = { emit, replaceState, clients: { bridge }, actions: { receiveProducts, receiveNavigationSort }, config };
        stub(RecommendationsAdapter, 'sortAndPinNavigations')
          .withArgs(response.availableNavigation, [], config).returns(availableNavigation);

        const task = ProductsTasks.fetchProducts(flux, false, action);

        expect(task.next().value).to.eql(effects.all(([
          effects.call(ProductsTasks.fetchProductsRequest, flux, action),
          effects.call(ProductsTasks.fetchNavigations, flux, action)
        ])));
        expect(task.next([response, undefined]).value).to.eql(effects.select(Selectors.config));
        expect(task.next(config).value).to.eql(effects.put(<any>[receiveProductsAction]));
        expect(emit).to.be.calledWithExactly(Events.BEACON_SEARCH, id);
        expect(receiveProducts).to.be.calledWithExactly({ ...response, availableNavigation });
        task.next();
        expect(replaceState).to.be.calledWith(utils.Routes.SEARCH, true);
      });

      it('should call actions.receiveRedirect when products.redirect is true', () => {
        const receiveProductsAction: any = { c: 'd' };
        const receiveNavigationsAction: any = { e: 'f' };
        const receiveRedirect = spy(() => receiveProductsAction);
        const receiveProducts = spy(() => receiveNavigationsAction);
        const flux = {
          actions: { receiveProducts, receiveRedirect },
          config: {
            search: {
              redirectSingleResult: false
            }
          },
          emit: () => undefined,
          saveState: () => undefined
        };

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{ hello: 'hello' });
        task.next();
        task.next([{ redirect: true }, undefined]);
        task.next();
        expect(task.next().done).to.be.true;
        expect(receiveRedirect).to.be.calledOnce;
      });

      it('should call fetchProductDetails when only a single result', () => {
        const receiveProductsAction: any = { c: 'd' };
        const receiveNavigationsAction: any = { e: 'f' };
        const fetchProductDetailsAction: any = { i: 'j' };
        const record: any = { g: 'h', allMeta: { id: 1 } };
        const receiveRedirect = spy(() => receiveProductsAction);
        const receiveProducts = spy(() => receiveNavigationsAction);
        const fetchProductDetails = spy(() => fetchProductDetailsAction);
        const config = {
          search: {
            redirectSingleResult: true
          }
        };
        const flux: any = {
          actions: { receiveProducts, receiveRedirect, fetchProductDetails },
          emit: () => undefined,
          saveState: () => undefined,
        };

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{});
        task.next();
        task.next([{ redirect: false, totalRecordCount: 1, records: [record] }, undefined]);
        expect(task.next(config).value).to.eql(effects.put(fetchProductDetailsAction));
        expect(fetchProductDetails).to.be.calledWith(record.allMeta.id, true);
        task.next();
      });

      it('should not sort navigations if navigations is an error', () => {
        const receiveProductsAction: any = { c: 'd' };
        const record: any = { g: 'h' };
        const receiveProducts = spy(() => receiveProductsAction);
        const products = { id: 2 };
        const config = {
          search: {
            redirectSingleResult: false
          }
        };
        const flux: any = {
          actions: { receiveProducts },
          emit: () => undefined,
          saveState: () => undefined
        };

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{});
        task.next();
        task.next(config);
        expect(task.next([products, new Error()]).value).to.eql(effects.put(receiveProductsAction));
      });

      it('should sort navigations if navigations received', () => {
        const receiveRecommendationsNavigationsAction: any = { c: 'd' };
        const record: any = { g: 'h' };
        const receiveNavigationSort = spy(() => receiveRecommendationsNavigationsAction);
        const products = { id: 2 };
        const receiveProductsAction: any = { c: 'd' };
        const receiveProducts = spy(() => receiveProductsAction);
        const config = {
          search: {
            redirectSingleResult: false
          },
          recommendations: {
            iNav: {
              navigations: {
                sort: true,
                pinned: undefined,
              },
              refinements: {
                sort: false,
                pinned: undefined,
              }
            }
          },
        };
        const flux: any = {
          actions: { receiveNavigationSort, receiveProducts },
          emit: () => undefined,
          saveState: () => undefined
        };

        const sortArray: any = [
          {
            name: 'cat-1', values: [{ value: 'test1', type: 'Value', count: 2 },
            { value: 'test8', type: 'Value', count: 8 },
            { value: 'test3', type: 'Value', count: 4 }],
          },
          { name: 'cat0', values: singleRefinement },
          { name: 'cat1', values: singleRefinement },
          { name: 'test1', values: singleRefinement },
        ];

        const sortedNavigations: any = [
          { name: 'cat-1', refinements: singleRefinement },
          { name: 'cat0', refinements: singleRefinement },
          { name: 'cat1', refinements: singleRefinement },
          { name: 'other', refinements: singleRefinement },
        ];

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{});
        task.next();
        task.next([{ availableNavigation }, sortArray]);
        expect(task.next(config).value)
          .to.eql(effects.put(<any>[receiveRecommendationsNavigationsAction, receiveProductsAction]));
        expect(receiveProducts.getCall(0).args[0]).to.eql({ availableNavigation: sortedNavigations });
      });

      it('should sort refinements if navigations received', () => {
        const receiveRecommendationsNavigationsAction: any = { c: 'd' };
        const record: any = { g: 'h' };
        const receiveNavigationSort = spy(() => receiveRecommendationsNavigationsAction);
        const products = { id: 2 };
        const receiveProductsAction: any = { c: 'd' };
        const receiveProducts = spy(() => receiveProductsAction);
        const config = {
          search: {
            redirectSingleResult: false
          },
          recommendations: {
            iNav: {
              navigations: {
                sort: false,
                pinned: undefined,
              },
              refinements: {
                sort: true,
                pinned: undefined,
              }
            }
          },
        };
        const flux: any = {
          actions: { receiveNavigationSort, receiveProducts },
          emit: () => undefined,
          saveState: () => undefined
        };

        const avail = [...availableNavigation];
        avail[2] = {
          ...availableNavigation[2], refinements: [...availableNavigation[2].refinements,
          { value: 'otherRef', type: 'Value', count: 9 }]
        };

        const sortArray: any = [
          {
            name: 'cat-1', values: [{ value: 'test1', type: 'Value', count: 2 },
            { value: 'test8', type: 'Value', count: 8 },
            { value: 'test3', type: 'Value', count: 4 }],
          },
          { name: 'cat0', values: singleRefinement },
          { name: 'cat1', values: singleRefinement },
          { name: 'test1', values: singleRefinement },
        ];

        const sortedNavigations: any = [
          { name: 'cat1', refinements: singleRefinement },
          { name: 'cat0', refinements: singleRefinement },
          {
            name: 'cat-1', refinements: [{ value: 'test1', type: 'Value', count: 2 },
            { value: 'test8', type: 'Value', count: 8 },
            { value: 'test3', type: 'Value', count: 4 },
            { value: 'otherRef', type: 'Value', count: 9 }]
          },
          { name: 'other', refinements: singleRefinement },
        ];

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{});
        task.next();
        task.next([{ availableNavigation: avail }, sortArray]);
        expect(task.next(config).value)
          .to.eql(effects.put(<any>[receiveRecommendationsNavigationsAction, receiveProductsAction]));
        expect(receiveProducts.getCall(0).args[0]).to.eql({ availableNavigation: sortedNavigations });
      });

      it('should sort navigations and refinements if navigations received', () => {
        const receiveRecommendationsNavigationsAction: any = { c: 'd' };
        const record: any = { g: 'h' };
        const receiveNavigationSort = spy(() => receiveRecommendationsNavigationsAction);
        const products = { id: 2 };
        const receiveProductsAction: any = { c: 'd' };
        const receiveProducts = spy(() => receiveProductsAction);
        const config = {
          search: {
            redirectSingleResult: false
          },
          recommendations: {
            iNav: {
              navigations: {
                sort: true,
                pinned: undefined,
              },
              refinements: {
                sort: true,
                pinned: undefined,
              }
            }
          },
        };
        const flux: any = {
          actions: { receiveNavigationSort, receiveProducts },
          emit: () => undefined,
          saveState: () => undefined
        };

        const avail = [...availableNavigation];
        avail[2] = {
          ...availableNavigation[2], refinements: [...availableNavigation[2].refinements,
          { value: 'otherRef', type: 'Value', count: 9 }]
        };

        const sortArray: any = [
          {
            name: 'cat-1', values: [{ value: 'test1', type: 'Value', count: 2 },
            { value: 'test8', type: 'Value', count: 8 },
            { value: 'test3', type: 'Value', count: 4 }],
          },
          { name: 'cat0', values: singleRefinement },
          { name: 'cat1', values: singleRefinement },
          { name: 'test1', values: singleRefinement },
        ];

        const sortedNavigations: any = [
          {
            name: 'cat-1', refinements: [{ value: 'test1', type: 'Value', count: 2 },
            { value: 'test8', type: 'Value', count: 8 },
            { value: 'test3', type: 'Value', count: 4 },
            { value: 'otherRef', type: 'Value', count: 9 }]
          },
          { name: 'cat0', refinements: singleRefinement },
          { name: 'cat1', refinements: singleRefinement },
          { name: 'other', refinements: singleRefinement },
        ];

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{});
        task.next();
        task.next([{ availableNavigation: avail }, sortArray]);
        expect(task.next(config).value).
          to.eql(effects.put(<any>[receiveRecommendationsNavigationsAction, receiveProductsAction]));
        expect(receiveProducts.getCall(0).args[0]).to.eql({ availableNavigation: sortedNavigations });
      });

      it('should call pinNavigations and pinRefinements when navigations received', () => {
        const receiveRecommendationsNavigationsAction: any = { c: 'd' };
        const record: any = { g: 'h' };
        const receiveNavigationSort = spy(() => receiveRecommendationsNavigationsAction);
        const products = { id: 2 };
        const receiveProductsAction: any = { c: 'd' };
        const receiveProducts = spy(() => receiveProductsAction);
        const sortAndPinNavigations = stub(RecommendationsAdapter, 'sortAndPinNavigations').returnsArg(0);
        const config = {
          search: {
            redirectSingleResult: false
          },
          recommendations: {
            iNav: {
              navigations: {
                sort: false,
                pinned: ['1', '2', '3', '4'],
              },
              refinements: {
                sort: false,
                pinned: {
                  1: ['1']
                }
              }
            }
          },
        };
        const flux: any = {
          actions: { receiveNavigationSort, receiveProducts },
          emit: () => undefined,
          saveState: () => undefined
        };

        const sortArray: any = [
          { name: 'cat-1', values: singleRefinement },
          { name: 'cat0', values: singleRefinement },
          { name: 'cat1', values: singleRefinement },
          { name: 'test1', values: singleRefinement },
        ];

        const task = ProductsTasks.fetchProducts(<any>flux, false, <any>{});
        task.next();
        task.next([{ availableNavigation }, sortArray]);
        expect(task.next(config).value)
          .to.eql(effects.put(<any>[receiveRecommendationsNavigationsAction, receiveProductsAction]));
        expect(receiveProducts.getCall(0).args[0]).to.eql({ availableNavigation });
        expect(sortAndPinNavigations).to.be.calledWith(availableNavigation, sortArray, config);
      });
    });

    describe('fetchProductsWhenHydrated()', () => {
      const payload: any = { a: 1 };

      it('should dispatch given action if data loaded from browser', () => {
        const getState = spy();
        const dispatch = spy();
        const flux: any = { store: { getState, dispatch } };
        stub(Selectors, 'realTimeBiasesHydrated').returns(true);

        const task = ProductsTasks.fetchProductsWhenHydrated(flux, <any>{ payload });
        expect(task.next().value).to.eql(effects.put(payload));
        task.next();

        expect(getState).to.be.calledWith();
      });

      it('should wait on personalization biasing rehydrated if data not loaded from browser', () => {
        const once = spy();
        const dispatch = spy();
        const getState = spy();
        const flux: any = { store: { getState, dispatch }, once };
        stub(Selectors, 'realTimeBiasesHydrated').returns(false);

        const task = ProductsTasks.fetchProductsWhenHydrated(flux, <any>{ payload });
        task.next();

        expect(dispatch).to.not.be.called;
        expect(once).to.be.calledWith(Events.PERSONALIZATION_BIASING_REHYDRATED);
        once.getCall(0).args[1]();
        expect(dispatch).to.be.calledWith(payload);
      });
    });

    describe('fetchProductsRequest()', () => {
      it('should return products', () => {
        const id = '1459';
        const search = () => null;
        const payload = { a: 'b' };
        const action: any = { payload };
        const biases = ['bias'];
        const request = { e: 'f', biasing: { biases }};
        const searchRequest = <any>{ e: 'f' };
        const response = { id, totalRecordCount: 3 };
        const flux: any = { };
        const state = { a: 'b' };
        const searchRequestCall = stub(Requests, 'search').returns(response);
        stub(productsRequest, 'composeRequest').withArgs(state).returns(request);

        const task = ProductsTasks.fetchProductsRequest(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.call(searchRequestCall, flux, request));
        task.next();
      });

      it('should override request', () => {
        const state = { a: 'b' };
        const override = { c: 'd' };
        const composeRequest = stub(productsRequest, 'composeRequest');

        const task = ProductsTasks.fetchProductsRequest(null, <any>{ payload: { request: override } });

        task.next();
        task.next(state);
        expect(composeRequest).to.be.calledWith(state, override);
      });

      it('should handle request failure', () => {
        const error = new Error();
        const flux: any = {};

        const task = ProductsTasks.fetchProductsRequest(flux, <any>{});

        expect(task.throw(error)).to.throw;
      });
    });

    describe('fetchMoreProducts()', () => {
      it('should return more products when fetching forward', () => {
        const id = '41892';
        const pageSize = 14;
        const emit = spy();
        const action: any = { payload: { amount: pageSize, forward: true } };
        const receiveMoreProductsAction: any = { c: 'd' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const records = ['g', 'h'];
        const results = { records, id };
        const flux: any = {
          emit,
          actions: { receiveMoreProducts, infiniteScrollRequestState }
        };
        const request = {
          e: 'f',
          pageSize,
          skip: 3
        };
        const searchRequest = stub(Requests, 'search').returns(results);
        stub(productsRequest, 'composeRequest').withArgs(state, { pageSize, skip: 3 }).returns(request);
        stub(Selectors, 'productsWithMetadata').returns([{ index: 1 }, { index: 2 }, { index: 3 }]);
        stub(Selectors, 'recordCount').returns(50);

        const task = ProductsTasks.fetchMoreProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledOnce.calledWithExactly({ isFetchingForward: true });
        expect(task.next(request).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(results).value).to.eql(effects.put(receiveMoreProductsAction));
        expect(receiveMoreProducts).to.be.calledWithExactly(results);
        expect(emit).to.be.calledWithExactly(Events.BEACON_SEARCH, id);
        expect(task.next().value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledTwice.calledWithExactly({ isFetchingForward: false });
        task.next();
      });

      it('should return more products when fetching forward and there are currently no products', () => {
        const id = '41892';
        const pageSize = 14;
        const emit = spy();
        const action: any = { payload: { amount: pageSize, forward: true } };
        const receiveMoreProductsAction: any = { c: 'd' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const records = ['g', 'h'];
        const results = { records, id };
        const flux: any = {
          emit,
          actions: { receiveMoreProducts, infiniteScrollRequestState }
        };
        const request = {
          e: 'f',
          pageSize,
          skip: 0
        };
        const searchRequest = stub(Requests, 'search').returns(results);
        stub(productsRequest, 'composeRequest').withArgs(state, { pageSize, skip: 0 }).returns(request);
        stub(Selectors, 'productsWithMetadata').returns([]);
        stub(Selectors, 'recordCount').returns(50);

        const task = ProductsTasks.fetchMoreProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledOnce.calledWithExactly({ isFetchingForward: true });
        expect(task.next(request).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(results).value).to.eql(effects.put(receiveMoreProductsAction));
        expect(receiveMoreProducts).to.be.calledWithExactly(results);
        expect(emit).to.be.calledWithExactly(Events.BEACON_SEARCH, id);
        expect(task.next().value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledTwice.calledWithExactly({ isFetchingForward: false });
        task.next();
      });

      it('should return previous products when fetching backward', () => {
        const id = '41892';
        const pageSize = 14;
        const emit = spy();
        const search = () => null;
        const action: any = { payload: { amount: pageSize, forward: false } };
        const receiveMoreProductsAction: any = { c: 'd' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const records = ['g', 'h'];
        const results = { records, id };
        const flux: any = {
          emit,
          actions: { receiveMoreProducts, infiniteScrollRequestState }
        };
        const request = {
          e: 'f',
          pageSize,
          skip: 0
        };
        const searchRequest = stub(Requests, 'search').returns(results);
        stub(productsRequest, 'composeRequest').withArgs(state, { pageSize, skip: 0 }).returns(request);
        stub(Selectors, 'productsWithMetadata').returns([{ index: 15 }, { index: 16 }, { index: 17 }]);
        stub(Selectors, 'recordCount').returns(50);

        const task = ProductsTasks.fetchMoreProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledOnce.calledWithExactly({ isFetchingBackward: true });
        expect(task.next(request).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(results).value).to.eql(effects.put(receiveMoreProductsAction));
        expect(receiveMoreProducts).to.be.calledWithExactly(results);
        expect(emit).to.be.calledWithExactly(Events.BEACON_SEARCH, id);
        expect(task.next().value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledTwice.calledWithExactly({ isFetchingBackward: false });
      });

      it('should throw error when skipping forward past the last record', () => {
        const products = [{ index: 1 }, { index: 2 }, { index: 3 }];
        const pageSize = 14;
        const action: any = { payload: { amount: pageSize, forward: true } };
        const receiveMoreProductsAction: any = { c: 'd' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const flux: any = {
          actions: { receiveMoreProducts, infiniteScrollRequestState }
        };
        stub(Selectors, 'recordCount').returns(products.length);

        const task = ProductsTasks.fetchMoreProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        task.next(state);
        expect(infiniteScrollRequestState).not.to.be.called;
        expect(receiveMoreProducts).to.be.calledWith(sinon.match.instanceOf(Error));
        task.next();
      });

      it('should throw error when skipping backwards past the first record', () => {
        const products = [{ index: 1 }, { index: 2 }, { index: 3 }];
        const pageSize = 14;
        const action: any = { payload: { amount: pageSize, forward: false } };
        const receiveMoreProductsAction: any = { c: 'd' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const flux: any = {
          actions: { receiveMoreProducts, infiniteScrollRequestState }
        };
        stub(Selectors, 'productsWithMetadata').returns(products);
        stub(Selectors, 'recordCount').returns(50);

        const task = ProductsTasks.fetchMoreProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        task.next(state);
        expect(infiniteScrollRequestState).not.to.be.called;
        expect(receiveMoreProducts).to.be.calledWith(sinon.match.instanceOf(Error));
        task.next();
      });

      it('should throw error when skipping backwards and there are currently no products', () => {
        const pageSize = 14;
        const action: any = { payload: { amount: pageSize, forward: false } };
        const receiveMoreProductsAction: any = { c: 'd' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const flux: any = {
          actions: { receiveMoreProducts, infiniteScrollRequestState }
        };
        stub(Selectors, 'productsWithMetadata').returns([]);
        stub(Selectors, 'recordCount').returns(50);

        const task = ProductsTasks.fetchMoreProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        task.next(state);
        expect(infiniteScrollRequestState).not.to.be.called;
        expect(receiveMoreProducts).to.be.calledWith(sinon.match.instanceOf(Error));
        task.next();
      });

      it('should override request', () => {
        const state = { a: 'b' };
        const pageSize = 14;
        const skip = 0;
        const flux: any = {
          actions: {
            infiniteScrollRequestState: () => ({}),
            receiveMoreProducts: () => ({}),
          }
        };
        const override = { c: 'd' };
        const composeRequest = stub(productsRequest, 'composeRequest');
        stub(Selectors, 'productsWithMetadata').returns([]);
        stub(Selectors, 'recordCount');
        stub(SearchAdapter, 'extractRecordCount');

        const task = ProductsTasks.fetchMoreProducts(flux, <any>{
          payload: { forward: true, amount: pageSize, request: override }
        });

        task.next();
        task.next(state);
        task.next();
        expect(composeRequest).to.be.calledWith(state, { pageSize, skip, ...override });
      });

      it('should throw error on failure', () => {
        const error = new Error();
        const receiveMoreProductsAction: any = { a: 'b' };
        const receiveMoreProducts = spy(() => receiveMoreProductsAction);
        const flux: any = {
          clients: { sayt: { productSearch: () => null } },
          actions: { receiveMoreProducts }
        };

        const task = ProductsTasks.fetchMoreProducts(flux, <any>{});

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveMoreProductsAction));
        expect(receiveMoreProducts).to.be.calledWith(error);
        task.next();
      });
    });

    describe('fetchNavigations()', () => {
      it('should return navigations', () => {
        const customerId = 'id';
        const config = {
          customerId,
          recommendations: {
            iNav: {
              ...iNavDefaults,
              navigations: {
                sort: true
              },
              refinements: {
                sort: true
              }
            }
          },
        };
        const recommendations = {
          result: [{ values: 'truthy' }, { values: false }, { values: 'literally truthy' }]
        };
        const returnVal: any = [{ values: 'truthy' }, { values: 'literally truthy' }];
        const jsonResult = 'hello';
        const state = { a: 'b' };
        const body = {
          minSize: iNavDefaults.minSize,
          sequence: [{
            size: iNavDefaults.size,
            window: iNavDefaults.window,
            matchPartial: { and: [{ search: { query: 2 } }] }
          },
          {
            size: iNavDefaults.size,
            window: iNavDefaults.window,
          }]
        };
        const recommendationsRequest = stub(Requests, 'recommendations').returns(recommendations);
        stub(recommendationsNavigationsRequest, 'composeRequest').withArgs(state).returns(body);

        const task = ProductsTasks.fetchNavigations(<any>{}, <any>{ payload: {} });

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(Selectors.config));
        expect(task.next(config).value).to.eql(effects.call(recommendationsRequest, {
          customerId,
          endpoint: 'refinements',
          mode: 'Popular',
          body,
        }));
        expect(task.next({ json: () => jsonResult }).value).to.eql(jsonResult);
        expect(task.next(recommendations).value).to.eql(returnVal);
        task.next();
      });

      it('should call receive navigations only when refinements sort is false', () => {
        const customerId = 'id';
        const config = {
          customerId,
          recommendations: {
            iNav: {
              ...iNavDefaults,
              minSize: undefined,
              navigations: {
                sort: true
              },
              refinements: {
                sort: false
              }
            }
          },
        };
        const recommendations = {
          result: [{ values: 'truthy' }, { values: false }, { values: 'literally truthy' }]
        };
        const returnVal: any = [{ values: 'truthy' }, { values: 'literally truthy' }];
        const jsonResult = 'hello';
        const state = { a: 'b' };
        const body = {
          minSize: iNavDefaults.size,
          sequence: [{
            size: iNavDefaults.size,
            window: iNavDefaults.window,
            matchPartial: { and: [{ search: { query: 2 } }] }
          },
          {
            size: iNavDefaults.size,
            window: iNavDefaults.window,
          }]
        };
        const recommendationsRequest = stub(Requests, 'recommendations').returns(recommendations);
        stub(recommendationsNavigationsRequest, 'composeRequest').withArgs(state).returns(body);

        const task = ProductsTasks.fetchNavigations(<any>{}, <any>{ payload: {} });

        task.next();
        task.next(state);
        expect(task.next(config).value).to.eql(effects.call(recommendationsRequest, {
          customerId,
          endpoint: 'refinements',
          mode: 'Popular',
          body,
        }));
        expect(task.next({ json: () => jsonResult }).value).to.eql(jsonResult);
        expect(task.next(recommendations).value).to.eql(returnVal);
        task.next();
      });

      it('should return nothing when navigations sort is off', () => {
        const customerId = 'id';
        const config =  {
          customerId,
          recommendations: {
            iNav: {
              navigations: {
                sort: false
              },
              refinements: {
                sort: false
              }
            }
          },
        };
        const recommendations = {
          result: [{ values: 'truthy' }, { values: false }, { values: 'literally truthy' }]
        };
        const returnVal: any = [{ values: 'truthy' }, { values: 'literally truthy' }];
        const jsonResult = 'hello';

        const task = ProductsTasks.fetchNavigations(<any>{}, <any>{ payload: {} });

        task.next();
        task.next();
        expect(task.next(config).value).to.eql([]);
        task.next();
      });

      it('should not call any actions when both navigations and refinements sort are off', () => {
        const receiveNavigationSort = spy((val) => val);
        const receiveRecommendationsRefinements = spy((val) => val);
        const customerId = 'id';
        const flux: any = {
          config: {
            customerId,
            recommendations: {
              iNav: {
                navigations: {
                  sort: false
                },
                refinements: {
                  sort: false
                }
              }
            },
          },
          actions: {
            receiveNavigationSort,
            receiveRecommendationsRefinements
          }
        };

        const task = ProductsTasks.fetchNavigations(flux, <any>{ payload: {} });

        task.next();
        expect(receiveRecommendationsRefinements).to.not.be.called;
        expect(receiveNavigationSort).to.not.be.called;
        task.next();
      });

      it('should return error on failure', () => {
        const error = new Error();
        const receiveRecommendationsNavigationsAction: any = { a: 'b' };
        const receiveRecommendationsRefinementsAction: any = { a: 'b' };
        const receiveNavigationSort = spy(() => receiveRecommendationsNavigationsAction);
        const receiveRecommendationsRefinements = spy(() => receiveRecommendationsRefinementsAction);
        const flux: any = {
          store: {
            getState: () => 1
          },
          config: {
            recommendations: {
              iNav: {
                navigations: {
                  sort: true
                },
                refinements: {
                  sort: true
                }
              }
            },
          }, actions: {
            receiveNavigationSort, receiveRecommendationsRefinements
          }
        };

        const task = ProductsTasks.fetchNavigations(flux, <any>{ payload: {} });
        task.next();
        expect(task.throw(error).value).to.eq(error);
      });
    });
  });
});
