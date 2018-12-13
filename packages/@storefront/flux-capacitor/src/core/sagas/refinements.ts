import * as effects from 'redux-saga/effects';
import FluxCapacitor from '../../flux-capacitor';
import Actions from '../actions';
import * as utils from '../actions/utils';
import RecommendationsAdapter from '../adapters/recommendations';
import RefinementsAdapter from '../adapters/refinements';
import Events from '../events';
import { refinementsRequest } from '../requests';
import Selectors from '../selectors';
import Store from '../store';
import RequestsTasks from './requests';

export namespace RefinementsTasks {
  // tslint:disable-next-line max-line-length
  export function* fetchMoreRefinements(flux: FluxCapacitor, { payload }: Actions.FetchMoreRefinements) {
    console.log('__ INSIDE `fetchMoreRefinements` SAGA TASK', payload); // TEMP

    try {
      const state: Store.State = yield effects.select();
      const config = yield effects.select(Selectors.config);

      // TODO: Ensure that the correct request is composed (either default/search or PP).
      const requestBody = refinementsRequest.composeRequest(state, payload.request);

      // TODO: Ensure that the item below works as expected.
      const res = yield effects.call(RequestsTasks.refinements, flux, requestBody, payload.navigationId);

      // TODO: Ensure that `BEACON_MORE_REFINEMENTS` is applicable when refinement-type is PP.
      flux.emit(Events.BEACON_MORE_REFINEMENTS, payload.navigationId);

      // TODO:
      // - Ensure that correct adapter is applied.
      // - Ensure that correct sort is applied.
      res.navigation = RecommendationsAdapter.sortAndPinNavigations(
        [res.navigation],
        Selectors.navigationSort(flux.store.getState()),
        config
      )[0];

      // TODO: Ensure that `mergeRefinements`  accounts for both default/search and PP-type refinements.
      const { navigationId, refinements, selected } = RefinementsAdapter.mergeRefinements(res, state);

      // TODO: Ensure that the correct action creator is invoked (based on refinement type).
      yield effects.put(flux.actions.receiveMoreRefinements(navigationId, refinements, selected));

    } catch (e) {
      // TODO: Ensure that the correct action is dispatched (based on refinement type).
      yield effects.put(utils.createAction(Actions.RECEIVE_MORE_REFINEMENTS, e));
    }
  }
}

export default (flux: FluxCapacitor) => function* saga() {
  yield effects.takeLatest(Actions.FETCH_MORE_REFINEMENTS, RefinementsTasks.fetchMoreRefinements, flux);
};
