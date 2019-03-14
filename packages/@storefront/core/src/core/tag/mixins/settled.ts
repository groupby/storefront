import { Events } from '@storefront/flux-capacitor';
import Tag from '..';
import Phase from '../phase';

export const PUSH_PHASES = [
  Phase.BEFORE_MOUNT,
  Phase.UPDATE,
];

export const POP_PHASES = [
  Phase.MOUNT,
  Phase.UPDATED,
];

// module globals
let inProgress = 0;
let timeout;

export default function settledMixin(settledTimeout: number) {
  return function(this: Tag) {
    const initTimeout = () => {
      console.log('DEBUG initTimeout', this.root.tagName, settledTimeout);
      return timeout = setTimeout(() => {
        const isFetchingData = this.select(this.flux.selectors.isFetching);
        const isFetching = Object.keys(isFetchingData).some((key) => isFetchingData[key]);

        if (isFetching) {
          clearTimeout(timeout);
          initTimeout();
        } else {
          this.flux.emit(Events.TAG_SETTLED);
        }
      }, settledTimeout);
    };

    PUSH_PHASES.forEach((phase) => this.on(phase, () => {
      clearTimeout(timeout);
      ++inProgress;
      console.log('DEBUG in progress', phase, inProgress, this.root.tagName);
    }));
    POP_PHASES.forEach((phase) => this.on(phase, () => {
      if (!--inProgress) initTimeout();
      console.log('DEBUG in progress', phase, inProgress, this.root.tagName);
    }));
  }
}
