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

export default function settledMixin(this: Tag) {
  PUSH_PHASES.forEach((phase) => this.on(phase, () => {
    clearTimeout(timeout);
    ++inProgress;
    console.log('DEBUG in progress', phase, inProgress, this.root.tagName);
  }));
  POP_PHASES.forEach((phase) => this.on(phase, () => {
    if (!--inProgress) timeout = setTimeout(() => this.flux.emit(Events.TAG_SETTLED), this.config.options.settledTimeout);
    console.log('DEBUG in progress', phase, inProgress, this.root.tagName);
  }));
}
