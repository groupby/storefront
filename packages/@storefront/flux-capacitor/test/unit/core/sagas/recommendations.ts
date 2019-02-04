import * as effects from 'redux-saga/effects';
import Actions from '../../../../src/core/actions';
import ConfigAdapter from '../../../../src/core/adapters/configuration';
import PageAdapter from '../../../../src/core/adapters/page';
import SearchAdapter from '../../../../src/core/adapters/search';
import * as RequestBuilders from '../../../../src/core/requests';
import sagaCreator, { MissingPayloadError, RecommendationsTasks } from '../../../../src/core/sagas/recommendations';
import Requests from '../../../../src/core/sagas/requests';
import Selectors from '../../../../src/core/selectors';
import * as utils from '../../../../src/core/utils';
import suite from '../../_suite';

suite('recommendations saga', ({ expect, spy, stub }) => {

  describe('createSaga()', () => {
    it('should return a saga', () => {
      const flux: any = { a: 'b', actions: {} };

      const saga = sagaCreator(flux)();

      // tslint:disable max-line-length
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_RECOMMENDATIONS_PRODUCTS, RecommendationsTasks.fetchRecommendationsProducts, flux));
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_PAST_PURCHASES, RecommendationsTasks.fetchPastPurchases, flux));
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_PAST_PURCHASE_PRODUCTS, RecommendationsTasks.fetchPastPurchaseProducts, flux));
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_SAYT_PAST_PURCHASES, RecommendationsTasks.fetchSaytPastPurchases, flux));
      expect(saga.next().value).to.eql(effects.takeEvery(Actions.FETCH_MORE_PAST_PURCHASE_PRODUCTS, RecommendationsTasks.fetchMorePastPurchaseProducts, flux));
      saga.next();
      // tslint:enable max-line-length
    });
  });

  describe('Tasks', () => {
    describe('fetchRecommendationsProducts()', () => {
      it('should return more refinements', () => {
        const customerId = 'myCustomer';
        const productCount = 8;
        const idField = 'myId';
        const location = { minSize: 10 };
        const config = { customerId, recommendations: { productSuggestions: { productCount }, location, idField } };
        const state = { c: 'd' };
        const records = ['a', 'b', 'c'];
        const receiveRecommendationsProductsAction: any = { a: 'b' };
        const receiveRecommendationsProducts = spy(() => receiveRecommendationsProductsAction);
        const recommendationsPromise = Promise.resolve();
        const recommendationsResponse = { result: [{ productId: '123' }, {}, { productId: '456' }] };
        const flux: any = { actions: { receiveRecommendationsProducts }, };
        const recommendationsRequest = stub(Requests, 'recommendations').returns(recommendationsResponse);
        const searchRequest = stub(Requests, 'search').returns({ records });
        const augmentProducts = stub(SearchAdapter, 'augmentProducts').returns(['x', 'x', 'x']);
        const matchExact = 'match exact';
        const requestBody = { c: 'd' };
        stub(RequestBuilders.recommendationsProductIdsRequest, 'composeRequest').withArgs(state).returns(matchExact);
        stub(RequestBuilders.recommendationsProductsRequest, 'composeRequest').withArgs(state, {
          pageSize: productCount,
          includedNavigations: [],
          skip: 0,
          refinements: [
            { navigationName: idField, type: 'Value', value: '123' },
            { navigationName: idField, type: 'Value', value: '456' }
          ]
        }).returns(requestBody);

        const task = RecommendationsTasks.fetchRecommendationsProducts(flux, <any>{ payload: {} });

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(Selectors.config));
        expect(task.next(config).value).to.eql(effects.call(recommendationsRequest, {
          customerId: config.customerId,
          endpoint: 'products',
          mode: 'Popular',
          body: matchExact
        }));
        expect(task.next({ json: () => recommendationsPromise }).value).to.eql(recommendationsPromise);
        expect(task.next(recommendationsResponse).value).to.eql(effects.call(searchRequest, flux, requestBody));
        expect(task.next({ records }).value).to.eql(effects.put(receiveRecommendationsProductsAction));
        expect(receiveRecommendationsProducts).to.be.calledWithExactly(['x', 'x', 'x']);
        expect(augmentProducts).to.be.calledWithExactly({ records });
        task.next();
      });

      it('should not return past purchases for 0 productCount', () => {
        const customerId = 'myCustomer';
        const productCount = 0;
        const productSuggestions = { productCount };
        const config = { customerId, recommendations: { productSuggestions } };

        const task = RecommendationsTasks.fetchRecommendationsProducts(<any>{}, <any>{ payload: {} });

        task.next();
        task.next(config);
        expect(task.next(config).done).to.be.true;
      });

      it('should override request', () => {
        const state = { a: 'b' };
        const override = { c: 'd' };
        const config = { recommendations: { productSuggestions: { productCount: 1 } } };
        const composeRequest = stub(RequestBuilders.recommendationsProductIdsRequest, 'composeRequest');

        const task = RecommendationsTasks.fetchRecommendationsProducts(null, <any>{ payload: { request: override } });

        task.next();
        task.next(state);
        task.next(config);
        expect(composeRequest).to.be.calledWith(state, override);
      });

      it('should handle request failure', () => {
        const error = new Error();
        const receiveRecommendationsProductsAction: any = { a: 'b' };
        const receiveRecommendationsProducts = spy(() => receiveRecommendationsProductsAction);
        const flux: any = { actions: { receiveRecommendationsProducts } };

        const task = RecommendationsTasks.fetchRecommendationsProducts(flux, <any>{ payload: {} });

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveRecommendationsProductsAction));
        expect(receiveRecommendationsProducts).to.be.calledWithExactly(error);
        task.next();
      });
    });

    describe('fetchPastPurchaseSkus()', () => {
      it('should fetch skus', () => {
        const securedPayload = 'secured';
        const customerId = 'id';
        const endpoint = 'end';
        const query = 'query';
        const jsonResult = 'json';
        const ret = { result: 'returned' };
        const secure = stub(ConfigAdapter, 'extractSecuredPayload').returns(securedPayload);
        const ppRequest = stub(Requests, 'pastPurchases').returns({ json: () => jsonResult });

        const task = RecommendationsTasks.fetchPastPurchaseSkus({ customerId }, endpoint, query);

        // tslint:disable-next-line max-line-length
        expect(task.next().value).to.eql(effects.call(ppRequest, {
          customerId,
          endpoint,
          body: { securedPayload, query }
        }));
        expect(task.next({ json: () => jsonResult }).value).to.eql(jsonResult);
        expect(task.next(ret).value).to.eql(ret.result);
      });

      it('should throw error if no secured payload', () => {
        const securedPayload = null;
        const customerId = 'id';
        stub(ConfigAdapter, 'extractSecuredPayload').returns(securedPayload);

        const task = RecommendationsTasks.fetchPastPurchaseSkus({ customerId }, 'endpoint');

        try {
          task.next();
          expect.fail();
        } catch (e) {
          expect(e).to.be.an.instanceof(MissingPayloadError);
          expect(e.message).to.eql('No Secured Payload');
        }
      });

      it('should throw error if falsy result', () => {
        const securedPayload = 'secured';
        stub(ConfigAdapter, 'extractSecuredPayload').returns(securedPayload);

        const task = RecommendationsTasks.fetchPastPurchaseSkus({ customerId: 'id' }, 'endpoint', 'query');

        try {
          task.next();
          task.next({ json: () => null });
          task.next({});
          expect.fail();
        } catch (e) {
          expect(e).to.be.an.instanceof(MissingPayloadError);
          expect(e.message).to.eql('No Secured Payload');
        }
      });
    });

    describe('fetchPastPurchases()', () => {
      const config = { a: 1 };

      it('should return if product count is 0', () => {
        const productCount = 0;
        const receivePastPurchaseSkus = spy(() => 1);
        const flux: any = { actions: { receivePastPurchaseSkus } };
        // tslint:disable-next-line max-line-length
        const extractPastPurchaseProductCount = stub(ConfigAdapter, 'extractPastPurchaseProductCount').returns(productCount);

        const task = RecommendationsTasks.fetchPastPurchases(flux, <any>{});

        expect(task.next().value).to.eql(effects.select(Selectors.config));
        expect(task.next(config).value).to.eql(effects.put(receivePastPurchaseSkus([])));
        expect(task.next().done).to.be.true;
        expect(extractPastPurchaseProductCount).to.be.calledWith(config);
      });

      it('should call fetchPastPurchases', () => {
        const productCount = 5;
        const data: any = { b: 2 };
        const navigations: any = [1, 2, 3];
        const allRecordCount = 50;
        const receivePastPurchaseAllRecordCount = spy(() => allRecordCount);
        const receivePastPurchaseSkus = spy(() => data);
        const flux: any = { actions: { receivePastPurchaseSkus, receivePastPurchaseAllRecordCount } };
        const resultArray = [1, 2, 3];
        // tslint:disable-next-line max-line-length
        const extractPastPurchaseProductCount = stub(ConfigAdapter, 'extractPastPurchaseProductCount').returns(productCount);

        const task = RecommendationsTasks.fetchPastPurchases(flux, <any>{});

        expect(task.next().value).to.eql(effects.select(Selectors.config));
        expect(task.next(config).value).to.eql(effects.call(<any>RecommendationsTasks.fetchPastPurchaseSkus, config, 'popular'));
        expect(task.next(resultArray).value).to.eql(effects.put(<any>[allRecordCount, data]));
        expect(task.next().done).to.be.true;
        expect(receivePastPurchaseSkus).to.be.calledWith(resultArray);
        expect(extractPastPurchaseProductCount).to.be.calledWith(config);
      });

      it('should handle request failure', () => {
        const error = new Error();
        const receivePastPurchaseSkus = spy(() => error);
        const flux: any = { actions: { receivePastPurchaseSkus } };

        const task = RecommendationsTasks.fetchPastPurchases(flux, <any>{});

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receivePastPurchaseSkus(error)));
        task.next();
      });

      it('should ignore missing payload errors', () => {
        const error = new MissingPayloadError();
        const receivePastPurchaseSkus = spy(() => error);
        const flux: any = { actions: { receivePastPurchaseSkus } };

        const task = RecommendationsTasks.fetchPastPurchases(flux, <any>{});

        task.next();
        expect(task.throw(error).value).to.eql(undefined);
      });
    });

    describe('fetchPastPurchaseProducts()', () => {
      it('should return if there are no pastPurchaseSkus', () => {
        const flux: any = {};
        const action: any = {};
        const config = {};

        const task = RecommendationsTasks.fetchPastPurchaseProducts(flux, action);

        expect(task.next().value).to.eql(effects.select(Selectors.pastPurchases));
        expect(task.next([]).done).to.be.true;
      });

      it('should override request', () => {
        const state = { a: 'b' };
        const override = { c: 'd' };
        const pastPurchaseFromSkus = { e: 'f' };
        const composeRequest = stub(RequestBuilders.pastPurchaseProductsRequest, 'composeRequest');
        stub(Selectors, 'pastPurchaseQuery').returns;

        const task = RecommendationsTasks.fetchPastPurchaseProducts(null, <any>{ payload: { request: override } });

        task.next();
        task.next(['a']);
        task.next(state);
        expect(composeRequest).to.be.calledWith(state, override);
      });

      it('should handle request failure', () => {
        const error = new Error();
        const receivePastPurchaseProducts = spy(() => 1);
        const flux: any = { actions: { receivePastPurchaseProducts } };
        const action: any = {};

        const task = RecommendationsTasks.fetchPastPurchaseProducts(flux, action);

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receivePastPurchaseProducts(error)));
        task.next();
      });

      it('should generate a request', () => {
        const getState = spy(() => ({ a: 1 }));
        const receivePastPurchaseProducts = spy(() => 1);
        const receivePastPurchaseSiteParams = spy(() => 2);
        const receivePastPurchasePage = spy(() => 3);
        const receivePastPurchaseCurrentRecordCount = spy(() => 4);
        const updatePastPurchasePageSize = spy(() => 3);
        const receivePastPurchaseTemplate = spy(() => 5);
        const receivePastPurchaseRefinements = spy(() => [1, 2, 3]);
        const saveState = spy();
        const replaceState = spy();
        const actions = {
          receivePastPurchaseSiteParams,
          receivePastPurchasePage,
          receivePastPurchaseProducts,
          receivePastPurchaseCurrentRecordCount,
          updatePastPurchasePageSize,
          receivePastPurchaseTemplate,
          receivePastPurchaseRefinements
        };
        const flux: any = { actions, saveState, store: { getState }, replaceState };
        const result = [1, 2, 3];
        const pageSize = 30;
        const request = { c: 3, skip: 5, pageSize };
        const totalRecordCount = 100;
        const productData = { selectedNavigation: [2, 3, 5], totalRecordCount };
        const currentPage = 2;
        const pastPurchaseSkus = [1, 2, 3, 4,];
        const pastPurchasesFromSkus = { a: 'b' };
        const navigations = [{ a: 'b' }, { c: 'd' }, { e: 'f' }];
        const prunedRefinements = [{ a: 'b' }, { e: 'f' }];
        const state = { c: 'd' };
        const augmentProducts = stub(SearchAdapter, 'augmentProducts').returns(productData);
        const extractRecordCount = stub(SearchAdapter, 'extractRecordCount').returns(productData);
        const searchRequest = stub(Requests, 'search').returns(result);
        stub(RequestBuilders.pastPurchaseProductsRequest, 'composeRequest')
          .withArgs(state)
          .returns(request);
        stub(PageAdapter, 'currentPage').withArgs(request.skip, request.pageSize).returns(currentPage);
        stub(SearchAdapter, 'combineNavigations').withArgs(productData).returns(navigations);
        stub(SearchAdapter, 'pruneRefinements')
          .withArgs(navigations)
          .returns(prunedRefinements);

        const task = RecommendationsTasks.fetchPastPurchaseProducts(flux, <any>{ payload: { buildAndParse: true } });

        expect(task.next().value).to.eql(effects.select(Selectors.pastPurchases));
        expect(task.next(pastPurchaseSkus).value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(productData).value).to.eql(effects.put(<any>[
          receivePastPurchaseSiteParams(),
          updatePastPurchasePageSize(),
          receivePastPurchasePage(),
          receivePastPurchaseCurrentRecordCount(),
          receivePastPurchaseProducts(),
          receivePastPurchaseTemplate(),
          receivePastPurchaseRefinements(),
        ]));
        task.next();

        expect(augmentProducts).to.be.calledWithExactly(productData);
        expect(receivePastPurchasePage).to.be.calledWithExactly(productData, currentPage, pageSize);
        expect(extractRecordCount).to.be.calledWithExactly(productData.totalRecordCount);
        expect(replaceState).to.be.calledWithExactly(utils.Routes.PAST_PURCHASE, true);
      });
    });

    describe('fetchMorePastPurchaseProducts()', () => {
      it('should return more products when fetching forward', () => {
        const pageSize = 14;
        const action: any = { payload: { amount: pageSize, forward: true } };
        const receiveMorePastProductsAction: any = { c: 'd' };
        const receiveMorePastPurchaseProducts = spy(() => receiveMorePastProductsAction);
        const receivePastPurchaseCurrentRecordCountAction: any = { i: 'j' };
        const receivePastPurchaseCurrentRecordCount = spy(() => receivePastPurchaseCurrentRecordCountAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const records = ['g', 'h'];
        const results = { records, totalRecordCount: 1 };
        const flux: any = {
          actions: {
            receiveMorePastPurchaseProducts,
            infiniteScrollRequestState,
            receivePastPurchaseCurrentRecordCount,
          }
        };
        const pastPurchaseSkus = [1,2,3,4,5];
        const request = { c: 'd' };
        const pastPurchasesFromSkus = { e: 'f' };
        const pastPurchaseSkusSelector = stub(Selectors, 'pastPurchases').returns(pastPurchaseSkus);
        const searchRequest = stub(Requests, 'search').returns(results);
        stub(Selectors, 'pastPurchaseProductsWithMetadata').returns([{ index: 1 }, { index: 2 }, { index: 3 }]);
        stub(RequestBuilders.pastPurchaseProductsRequest, 'composeRequest').withArgs(state, {
          pageSize,
          skip: 3,
        }).returns(request);

        const task = RecommendationsTasks.fetchMorePastPurchaseProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(pastPurchaseSkusSelector));
        expect(task.next(pastPurchaseSkus).value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledOnce.calledWithExactly({ isFetchingForward: true });
        expect(task.next(request).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(results).value).to.eql(effects.put(<any>[
          receivePastPurchaseCurrentRecordCountAction,
          receiveMorePastProductsAction,
        ]));
        expect(task.next().value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledTwice.calledWithExactly({ isFetchingForward: false });
        task.next();

      });

      it('should return previous products when fetching backward', () => {
        const pageSize = 14;
        const emit = spy();
        const action: any = { payload: { amount: pageSize, forward: false } };
        const receiveMorePastProductsAction: any = { c: 'd' };
        const receiveMorePastPurchaseProducts = spy(() => receiveMorePastProductsAction);
        const receivePastPurchaseCurrentRecordCountAction: any = { i: 'j' };
        const receivePastPurchaseCurrentRecordCount = spy(() => receivePastPurchaseCurrentRecordCountAction);
        const infiniteScrollRequestStateAction: any = { e: 'f' };
        const infiniteScrollRequestState = spy(() => infiniteScrollRequestStateAction);
        const state = { e: 'f' };
        const records = ['g', 'h'];
        const results = { records, totalRecordCount: 1 };
        const flux: any = {
          emit,
          actions: {
            receiveMorePastPurchaseProducts,
            infiniteScrollRequestState,
            receivePastPurchaseCurrentRecordCount,
          }
        };
        const pastPurchaseSkus = [1,2,3,4,5];
        const request = { c: 'd' };
        const pastPurchasesFromSkus = { e: 'f' };
        const pastPurchaseSkusSelector = stub(Selectors, 'pastPurchases').returns(pastPurchasesFromSkus);
        const searchRequest = stub(Requests, 'search').returns(results);
        stub(Selectors, 'pastPurchaseProductsWithMetadata').returns([{ index: 11 }, { index: 12 }, { index: 13 }]);
        stub(Selectors, 'pastPurchasePageSize').returns(10);
        stub(RequestBuilders.pastPurchaseProductsRequest, 'composeRequest').withArgs(state, {
          pageSize,
          skip: 0,
        }).returns(request);

        const task = RecommendationsTasks.fetchMorePastPurchaseProducts(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(pastPurchaseSkusSelector));
        expect(task.next(pastPurchaseSkus).value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledOnce.calledWithExactly({ isFetchingBackward: true });
        expect(task.next(request).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(results).value).to.eql(effects.put(<any>[
          receivePastPurchaseCurrentRecordCountAction,
          receiveMorePastProductsAction,
        ]));
        expect(task.next().value).to.eql(effects.put(infiniteScrollRequestStateAction));
        expect(infiniteScrollRequestState).to.be.calledTwice.calledWithExactly({ isFetchingBackward: false });
        task.next();
      });

      it('should override request', () => {
        const state = { a: 'b' };
        const override = { c: 'd' };
        const pageSize = 20;
        const pastPurchaseFromSkus = { e: 'f' };
        const infiniteScrollRequestState = spy(() => ({}));
        const flux: any = {
          actions: {
            infiniteScrollRequestState
          },
        };
        const action: any = {
          payload: {
            forward: true,
            request: override,
            amount: pageSize,
          }
        };
        const composeRequest = stub(RequestBuilders.pastPurchaseProductsRequest, 'composeRequest');
        stub(Selectors, 'pastPurchaseProductsWithMetadata').returns([{ index: 13 }]);

        const task = RecommendationsTasks.fetchMorePastPurchaseProducts(flux, action);

        task.next();
        task.next(state);
        task.next();
        task.next();
        expect(composeRequest).to.be.calledWith(state, {
          pageSize,
          skip: 13,
          ...override,
        });
      });

      it('should throw error on failure', () => {
        const error = new Error();
        const receiveMorePastPurchaseProductsAction: any = { a: 'b' };
        const receiveMorePastPurchaseProducts = spy(() => receiveMorePastPurchaseProductsAction);
        const flux: any = {
          clients: { sayt: { productSearch: () => null } },
          actions: { receiveMorePastPurchaseProducts }
        };

        const task = RecommendationsTasks.fetchMorePastPurchaseProducts(flux, <any>{});

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveMorePastPurchaseProductsAction));
        expect(receiveMorePastPurchaseProducts).to.be.calledWith(error);
        task.next();
      });
    });

    describe('fetchSaytPastPurchases()', () => {
      it('should return if data.length is 0', () => {
        const receiveSaytPastPurchases = spy(() => 1);
        const flux: any = { actions: { receiveSaytPastPurchases } };
        const payload = { a: 1 };
        const action: any = { payload };
        const state = { a: 'b' };

        const task = RecommendationsTasks.fetchSaytPastPurchases(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(Selectors.pastPurchases));
        expect(task.next([]).value).to.eql(effects.put(receiveSaytPastPurchases()));
        expect(task.next().done).to.be.true;
        expect(receiveSaytPastPurchases).to.be.calledWith([]);
      });

      it('should make a request', () => {
        const receiveSaytPastPurchases = spy(() => 1);
        const flux: any = { actions: { receiveSaytPastPurchases } };
        const payload = 'q';
        const action: any = { payload: { query: payload } };
        const state = { b: 'c' };
        const result = [1, 2, 3];
        const productData = { c: 3 };
        const request = { d: 4, query: payload };
        const pastPurchaseSkus = [1,2,3,4,5];
        const augmentProducts = stub(SearchAdapter, 'augmentProducts').returns(productData);
        const searchRequest = stub(Requests, 'search').returns(result);
        const t = stub(RequestBuilders.autocompletePastPurchaseRequest, 'composeRequest')
          .withArgs(state, { query: payload }).returns(request);
        stub(Selectors, 'pastPurchases').returns(pastPurchaseSkus);

        const task = RecommendationsTasks.fetchSaytPastPurchases(flux, action);

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(Selectors.pastPurchases));
        expect(task.next(pastPurchaseSkus).value).to.eql(effects.call(searchRequest, flux, request));
        expect(task.next(productData).value).to.eql(effects.put(receiveSaytPastPurchases()));
        expect(task.next().done).to.be.true;
        expect(receiveSaytPastPurchases).to.be.calledWithExactly(productData);
        expect(augmentProducts).to.be.calledWithExactly(productData);
      });

      it('should override request', () => {
        const query = 'hello';
        const override = { a: 'b' };
        const state = { c: 'd' };
        const action: any = {
          payload: {
            query,
            request: override
          }
        };
        const composeRequest = stub(RequestBuilders.autocompletePastPurchaseRequest, 'composeRequest');

        const task = RecommendationsTasks.fetchSaytPastPurchases(<any>{}, action);

        task.next();
        task.next(state);
        task.next(['a']);
        expect(composeRequest).to.be.calledWith(state, { query, ...override });
      });

      it('should handle request failure', () => {
        const error = new Error();
        const receiveSaytPastPurchases = spy(() => 1);
        const flux: any = { actions: { receiveSaytPastPurchases } };
        const action: any = { payload: {} };

        const task = RecommendationsTasks.fetchSaytPastPurchases(flux, action);

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveSaytPastPurchases(error)));
        task.next();
      });
    });
  });
});
