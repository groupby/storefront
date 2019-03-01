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
let timeout: any = -1;

export default function settledMixin(this: Tag) {
  PUSH_PHASES.forEach((phase) => this.on(phase, () => {
    clearTimeout(timeout);
    ++inProgress;
  }));
  POP_PHASES.forEach((phase) => this.on(phase, () => {
    if (!--inProgress) timeout = setTimeout(() => this.flux.emit(Events.TAG_SETTLED), 100);
  }));
}
