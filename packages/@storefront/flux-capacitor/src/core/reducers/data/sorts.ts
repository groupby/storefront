import Actions from '../../actions';
import Store from '../../store';

export type Action = Actions.SelectSort | Actions.ApplySorts;
export type State = Store.SelectableList<Store.Sort>;

export const DEFAULTS: State = {
  items: [
    { field: '_relevance', descending: true }
  ],
  selected: 0,
};

export default function updateSorts(state: State = DEFAULTS, action: Action): State {
  switch (action.type) {
    case Actions.SELECT_SORT: return updateSelected(state, action.payload);
    case Actions.APPLY_SORTS: return applySorts(state, action.payload);
    default: return state;
  }
}

export const updateSelected = (state: State, selected: number) =>
  ({ ...state, selected });

export const applySorts = (state: State, { options }: { options: Store.Sort[] }) => {
  return {
    ...state,
    items: options,
  };
};
