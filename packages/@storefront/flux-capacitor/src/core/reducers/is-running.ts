import Actions from '../actions';

export type Action = Actions.StartApp | Actions.ShutdownApp;
export type State = boolean;

export default function updateIsRunning(state: State = false, action: Action): State {
  switch (action.type) {
    case Actions.START_APP: return true;
    case Actions.SHUTDOWN_APP: return false;
    default: return state;
  }
}
