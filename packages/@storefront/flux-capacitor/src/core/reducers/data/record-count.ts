import Actions from '../../actions';
import SearchAdapter from '../../adapters/search';

export type Action = Actions.ReceiveRecordCount;
export type State = number;

export default function updateRecordCount(state: State = null, action: Action): State {
  switch (action.type) {
    case Actions.RECEIVE_RECORD_COUNT: return update(state, action);
    default: return state;
  }
}

export const update = (_: State, { payload: count }: Actions.ReceiveRecordCount): number => {
  return SearchAdapter.isResult(count) ? count.totalRecordCount : count;
};
