import Actions from '../../actions';
import Store from '../../store';

export type Action = Actions.ReceiveSiteParams;
export type State = Store.SiteParams[];

export const DEFAULT_PARAMS: any = [];

export default function updateParams(state: State = DEFAULT_PARAMS, action: Action): State {
  switch (action.type) {
    case Actions.RECEIVE_SITE_PARAMS:
      return update(state, action.payload);
    default: return state;
  }
}

export const update = (state: State, payload: State) => payload;
