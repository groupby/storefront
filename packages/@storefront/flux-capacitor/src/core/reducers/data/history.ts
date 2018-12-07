import Actions from '../../actions';
import Store from '../../store';

export type Action = Actions.PushState
export type State = Store.History;

export const DEFAULTS: State = {
  request: {},
  route: '',
  url: '',
};

export default function updateHistory(state: State = DEFAULTS, action: Action): State {
  switch (action.type) {
    case Actions.PUSH_STATE: return updateHistoryState(state, action.payload);
    default: return state;
  }
}

export const updateHistoryState = (state, { url = '', route = '', request = {} }) =>
  ({ ...state, url, route, request });
