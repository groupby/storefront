import * as redux from 'redux';
import undoable, { includeAction } from 'redux-undo';
import Actions from '../actions';
import ConfigAdapter from '../adapters/configuration';
import Store from '../store';
import data from './data';
import isFetching from './is-fetching';
import isRunning from './is-running';
import session from './session';
import ui from './ui';

export type Action = Actions.RefreshState;

export const undoWithoutHistory = (store, flux) => {
  return (state, action) => {
    const config = {
      limit: 1,
      filter: includeAction(Actions.SAVE_STATE),
    };
    const reducer = undoable(data, config);
    const { history, ...newState } = reducer(state, action, flux);

    return newState;
  };
};

export const rootReducer = (state, action, flux) => {
  return redux.combineReducers<Store.State>({
    isRunning,
    isFetching,
    session,
    data: undoWithoutHistory(state, flux),
    ui,
  })(state, action);
};

export default (flux) => (state: Store.State, action: Action) => {
  switch (action.type) {
    case Actions.REFRESH_STATE: return updateState(state, action);
    default: return rootReducer(state, action, flux);
  }
};

export const updateState = (state: Store.State, { payload }: Actions.RefreshState) => {
  return {
    ...payload,
    session: state.session,
    data: {
      past: [],
      present: {
        ...payload.data.present,
        personalization: {
          ...payload.data.present.personalization,
          biasing: state.data.present.personalization.biasing,
        },
        autocomplete: state.data.present.autocomplete,
      },
      future: []
    }
  };
};
