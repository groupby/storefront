import Actions from '../../actions';
import Store from '../../store';

export type Action = Actions.UpdateHistory;
export type State = Store.History;

export const DEFAULTS: State = {
  request: {},
  route: '',
  url: '',
  shouldFetch: false,
};

export default function updateHistory(state: State = DEFAULTS, action: Action): State {
  switch (action.type) {
    case Actions.UPDATE_HISTORY: return updateHistoryState(state, action.payload);
    default: return state;
  }
}

export const updateHistoryState = (
  state,
  {
    url = state.url,
    route = state.route,
    request = state.request,
    shouldFetch = state.shouldFetch,
  } = {}
) => ({ ...state, url, route, request, shouldFetch });
