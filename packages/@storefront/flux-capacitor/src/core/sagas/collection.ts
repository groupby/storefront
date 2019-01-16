import * as effects from 'redux-saga/effects';
import FluxCapacitor from '../../flux-capacitor';
import Actions from '../actions';
import { collectionRequest } from '../requests';
import Selectors from '../selectors';
import RequestsTasks from './requests';

export namespace CollectionTasks {
  // tslint:disable-next-line max-line-length
  export function* fetchCount(flux: FluxCapacitor, { payload: { collection, request, buildAndParse } }: Actions.FetchCollectionCount) {
    try {
      const state = yield effects.select();
      const requestBody = collectionRequest.composeRequest(state, { collection, ...request });
      const res = yield effects.call(RequestsTasks.search, flux, requestBody);

      yield effects.put(flux.actions.receiveCollectionCount({
        collection,
        count: res.totalRecordCount
      }));

      flux.replaceState(Selectors.route(state), buildAndParse);
    } catch (e) {
      yield effects.put(flux.actions.receiveCollectionCount(e));
    }
  }
}

export default (flux: FluxCapacitor) => function* saga() {
  yield effects.takeEvery(Actions.FETCH_COLLECTION_COUNT, CollectionTasks.fetchCount, flux);
};
