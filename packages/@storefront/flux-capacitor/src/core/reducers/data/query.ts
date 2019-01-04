import Actions from '../../actions';
import Store from '../../store';

export type Action = Actions.UpdateQuery | Actions.ReceiveQuery;
export type State = Store.Query;

export const DEFAULTS: State = {
  corrected: undefined,
  didYouMean: [],
  related: [],
  rewrites: [],
};

export default function updateQuery(state: State = DEFAULTS, action: Action): State {
  switch (action.type) {
    case Actions.UPDATE_QUERY: return receiveQuery(state, { ...DEFAULTS, original: action.payload });
    case Actions.RECEIVE_QUERY: return receiveQuery(state, action.payload);
    default: return state;
  }
}

// tslint:disable-next-line max-line-length
export const receiveQuery = (state: State, { corrected, didYouMean, original, related, rewrites }: Actions.Payload.Query) =>
  ({ ...state, corrected, didYouMean, original, related, rewrites });
