import * as effects from 'redux-saga/effects';
import Actions from '../../../../src/core/actions';
import * as utils from '../../../../src/core/actions/utils';
import RecommendationsAdapter from '../../../../src/core/adapters/recommendations';
import Adapter from '../../../../src/core/adapters/refinements';
import Events from '../../../../src/core/events';
import { pastPurchaseProductsRequest, refinementsRequest } from '../../../../src/core/requests';
import sagaCreator, { RefinementsTasks } from '../../../../src/core/sagas/refinements';
import Requests from '../../../../src/core/sagas/requests';
import Selectors from '../../../../src/core/selectors';
import suite from '../../_suite';

suite('refinements saga', ({ expect, spy, stub }) => {

  describe('createSaga()', () => {
    it('should return a saga', () => {
      const flux: any = { a: 'b', actions: {} };

      const saga = sagaCreator(flux)();

      // tslint:disable-next-line max-line-length
      expect(saga.next().value).to.eql(effects.takeLatest(Actions.FETCH_MORE_REFINEMENTS, RefinementsTasks.fetchMoreRefinements, flux));
      saga.next();
    });
  });

  describe('Tasks', () => {
    describe('fetchMorePastPurchaseRefinements', () => {
      it('should return more refinements', () => {
        const navigationId = 'colour';
        const mergedRefinements = [];
        const pastPurchases = [1, 2, 3];
        const selected = [];
        const receiveMorePastPurchaseRefinementsAction: any = { c: 'd' };
        const receiveMorePastPurchaseRefinements = spy(() => receiveMorePastPurchaseRefinementsAction);
        const request = { baz: 'quux' };
        const state = { i: 'j'};
        const store = { getState: () => 1 };
        const emit = spy();
        const flux: any = { actions: { receiveMorePastPurchaseRefinements }, store, emit };
        const results = { navigation: { sort: false, pinned: false }};
        const refinementsFinalRequest = stub(Requests, 'refinements').returns(results);
        const mergePastPurchaseRefinements = stub(Adapter, 'mergePastPurchaseRefinements')
          .returns({ navigationId, refinements: mergedRefinements, selected });
        const composeRequest = stub(pastPurchaseProductsRequest, 'composeRequest').returns(request);
        stub(Selectors, 'pastPurchases').returns(pastPurchases);

        // tslint:disable-next-line  max-line-length
        const task = RefinementsTasks.fetchMorePastPurchaseRefinements(flux, <any>{ payload: { navigationId, request } });

        expect(task.next().value).to.eql(effects.select(Selectors.pastPurchases));
        expect(task.next(pastPurchases).value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.call(refinementsFinalRequest, flux, request, navigationId));
        expect(task.next(results).value).to.eql(effects.put(receiveMorePastPurchaseRefinementsAction));
        expect(mergePastPurchaseRefinements).to.be.calledWith(results, state);
        expect(receiveMorePastPurchaseRefinements).to.be.calledWithExactly(navigationId, mergedRefinements, selected);
        expect(composeRequest).to.be.calledWith(state, request);
      });

      it('should override request', () => {
        const state = { c: 'd' };
        const override = { a: 'b' };
        const action: any = {
          payload: {
            request: override
          }
        };
        const pastPurchases = [1, 2, 3];
        const composeRequest = stub(pastPurchaseProductsRequest, 'composeRequest');

        const task = RefinementsTasks.fetchMorePastPurchaseRefinements(<any>{}, action);

        task.next();
        task.next(pastPurchases);
        task.next(state);
        expect(composeRequest).to.be.calledWith(state, override);
      });

      it('should handle request failure', () => {
        const error = new Error();
        const receiveMorePastPurchaseRefinementsAction: any = { a: 'b' };
        const flux: any = {};
        const action = stub(utils, 'createAction').returns(receiveMorePastPurchaseRefinementsAction);

        const task = RefinementsTasks.fetchMorePastPurchaseRefinements(flux, <any>{});

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveMorePastPurchaseRefinementsAction));
        expect(action).to.be.calledWith(Actions.RECEIVE_MORE_PAST_PURCHASE_REFINEMENTS, error);
        task.next();
      });
    });

    describe('fetchMoreRefinements()', () => {
      it('should return more refinements', () => {
        const navigationId = 'colour';
        const config = {
          recommendations: {
            iNav: {
              refinements: {
                sort: false,
                pinned: false
              }
            }
          }
        };
        const mergedRefinements = ['k', 'l'];
        const selected = ['m', 'n'];
        const receiveMoreRefinementsAction: any = { c: 'd' };
        const receiveMoreRefinements = spy(() => receiveMoreRefinementsAction);
        const request = { g: 'h' };
        const state = { i: 'j'};
        const store = { getState: () => 1 };
        const results = { navigation: { sort: false, pinned: false }};
        const emit = spy();
        const flux: any = { actions: { receiveMoreRefinements }, store, emit };
        const refinementsFinalRequest = stub(Requests, 'refinements').returns(results);
        const mergeRefinements = stub(Adapter, 'mergeRefinements').returns({
          navigationId,
          refinements: mergedRefinements,
          selected
        });
        stub(refinementsRequest, 'composeRequest').withArgs(state).returns(request);
        stub(Selectors, 'navigationSort').returns([]);
        stub(RecommendationsAdapter, 'sortAndPinNavigations')
          .withArgs([results.navigation], [], config).returns(results);

        const task = RefinementsTasks.fetchMoreRefinements(flux, <any>{ payload: { navigationId } });

        expect(task.next().value).to.eql(effects.select());
        expect(task.next(state).value).to.eql(effects.select(Selectors.config));
        expect(task.next(config).value).to.eql(effects.call(refinementsFinalRequest, flux, request, navigationId));
        expect(task.next(results).value).to.eql(effects.put(receiveMoreRefinementsAction));
        expect(mergeRefinements).to.be.calledWithExactly(results, state);
        expect(receiveMoreRefinements).to.be.calledWithExactly(navigationId, mergedRefinements, selected);
        expect(flux.emit).to.be.calledWithExactly(Events.BEACON_MORE_REFINEMENTS, navigationId);
        task.next();
      });

      it('should override request', () => {
        const state = { c: 'd' };
        const override = { a: 'b' };
        const action: any = {
          payload: {
            request: override
          }
        };
        const composeRequest = stub(refinementsRequest, 'composeRequest');

        const task = RefinementsTasks.fetchMoreRefinements(<any>{}, action);

        task.next();
        task.next(state);
        task.next();
        expect(composeRequest).to.be.calledWith(state, override);
      });

      it('should handle request failure', () => {
        const error = new Error();
        const receiveMoreRefinementsAction: any = { a: 'b' };
        const flux: any = {};
        const action = stub(utils, 'createAction').returns(receiveMoreRefinementsAction);

        const task = RefinementsTasks.fetchMoreRefinements(flux, <any>{});

        task.next();
        expect(task.throw(error).value).to.eql(effects.put(receiveMoreRefinementsAction));
        expect(action).to.be.calledWith(Actions.RECEIVE_MORE_REFINEMENTS, error);
        task.next();
      });
    });
  });
});
