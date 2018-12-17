import { Biasing, Sort } from 'groupby-api';
import * as effects from 'redux-saga/effects';
import FluxCapacitor from '../../flux-capacitor';
import Actions from '../actions';
import * as utils from '../actions/utils';
import RecommendationsAdapter from '../adapters/recommendations';
import RefinementsAdapter from '../adapters/refinements';
import Events from '../events';
import {
  pastPurchaseProductsRequest,
  refinementsRequest,
} from '../requests';
import Selectors from '../selectors';
import Store from '../store';
import RequestsTasks from './requests';

export namespace RefinementsTasks {
  // tslint:disable-next-line max-line-length
  export function* fetchMorePastPurchaseRefinements(flux: FluxCapacitor, { payload }: Actions.FetchMoreRefinements  | Actions.FetchMorePastPurchaseRefinements) {
    try {
      const pastPurchaseSkus: Store.PastPurchases.PastPurchaseProduct[] = yield effects.select(Selectors.pastPurchases);

      if (pastPurchaseSkus.length > 0) {
        const state: Store.State = yield effects.select();
        const requestBody = pastPurchaseProductsRequest.composeRequest(state, payload.request);
        const res = yield effects.call(RequestsTasks.refinements, flux, requestBody, payload.navigationId);

        flux.emit(Events.BEACON_MORE_REFINEMENTS, payload.navigationId);
        const { navigationId, refinements, selected } = RefinementsAdapter.mergePastPurchaseRefinements(res, state);
        yield effects.put(flux.actions.receiveMorePastPurchaseRefinements(navigationId, refinements, selected));
      }
    } catch (e) {
      yield effects.put(utils.createAction(Actions.RECEIVE_MORE_PAST_PURCHASE_REFINEMENTS, e));
    }
  }

  // tslint:disable-next-line max-line-length
  export function* fetchMoreRefinements(flux: FluxCapacitor, { payload }: Actions.FetchMoreRefinements | Actions.FetchMorePastPurchaseRefinements) {
    try {
      const state: Store.State = yield effects.select();
      const config = yield effects.select(Selectors.config);
      const requestBody = refinementsRequest.composeRequest(state, payload.request);
      const res = yield effects.call(RequestsTasks.refinements, flux, requestBody, payload.navigationId);

      flux.emit(Events.BEACON_MORE_REFINEMENTS, payload.navigationId);
      res.navigation = RecommendationsAdapter.sortAndPinNavigations(
        [res.navigation],
        Selectors.navigationSort(flux.store.getState()),
        config
      )[0];
      const { navigationId, refinements, selected } = RefinementsAdapter.mergeRefinements(res, state);
      yield effects.put(flux.actions.receiveMoreRefinements(navigationId, refinements, selected));
    } catch (e) {
      yield effects.put(utils.createAction(Actions.RECEIVE_MORE_REFINEMENTS, e));
    }
  }
}

export default (flux: FluxCapacitor) => function* saga() {
  yield effects.takeLatest(Actions.FETCH_MORE_REFINEMENTS, RefinementsTasks.fetchMoreRefinements, flux);
  // tslint:disable-next-line max-line-length
  yield effects.takeLatest(Actions.FETCH_MORE_PAST_PURCHASE_REFINEMENTS, RefinementsTasks.fetchMorePastPurchaseRefinements, flux);
};
