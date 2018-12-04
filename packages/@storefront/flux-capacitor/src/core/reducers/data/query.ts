import { Results } from 'groupby-api';
import Actions from '../../actions';
import SearchAdapter from '../../adapters/search';
import Store from '../../store';

export type Action = Actions.UpdateQuery | Actions.ReceiveQuery;
export type State = Store.Query;

export const DEFAULTS: State = {
  didYouMean: [],
  related: [],
  rewrites: [],
};

export default function updateQuery(state: State = DEFAULTS, action: Action): State {
  switch (action.type) {
    case Actions.UPDATE_QUERY: return updateOriginal(state, action.payload);
    case Actions.RECEIVE_QUERY: return receiveQuery(state, action);
    default: return state;
  }
}

export const updateOriginal = (state: State, query: string) =>
  ({ ...state, original: query });

// tslint:disable-next-line max-line-length
export const receiveQuery = (state: State, { payload: query }: Actions.ReceiveQuery) => {
  const {
    corrected = state.corrected,
    didYouMean = state.didYouMean,
    original = state.original,
    related = state.related,
    rewrites = state.rewrites
  } = SearchAdapter.isResult(query) ? SearchAdapter.extractQuery(query) : query;

  return { ...state, corrected, didYouMean, original, related, rewrites };
};
