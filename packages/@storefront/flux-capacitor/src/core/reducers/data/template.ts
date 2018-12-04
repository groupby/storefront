import Actions from '../../actions';
import SearchAdapter from '../../adapters/search';
import Store from '../../store';

export type Action = Actions.ReceiveTemplate;
export type State = Store.Template;

export default function updateTemplate(state: State = <any>{}, action: Action): State {
  switch (action.type) {
    case Actions.RECEIVE_TEMPLATE: return update(state, action);
    default: return state;
  }
}

export const update = (_: State, { payload: template }: Actions.ReceiveTemplate): State => {
  return SearchAdapter.isResult(template) ? SearchAdapter.extractTemplate(<any>template) : template;
};
