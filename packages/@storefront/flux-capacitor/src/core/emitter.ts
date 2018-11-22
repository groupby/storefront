import { EventEmitter } from 'eventemitter3';

class Emitter extends EventEmitter {
  _barriers: Barriers = {};
  _lookups: Lookups = {};

  emit(event: string, ...args: any[]): boolean {
    const result = super.emit(event, ...args);
    const keys = this._lookups[event] || [];

    keys.forEach((key) => {
      this._barriers[key].events[event]++;

      const shouldInvoke = Object.keys(this._barriers[key].events).every((ev) => this._barriers[key].events[ev] > 0);

      if (shouldInvoke) {
        this._barriers[key].callbacks.forEach(({ callback, context }) => callback.apply(context));
        // tslint:disable-next-line max-line-length
        this._barriers[key].events = Object.keys(this._barriers[key].events).reduce((acc, ev) => Object.assign(acc, { [ev]: 0 }), {});
      }
    });

    return result;
  }

  all(events: string[], callback: () => void, context: any = this) {
    if (!Array.isArray(events)) {
      throw new Error('`events` is not an array.');
    }

    if (!events.length) {
      return;
    }

    const key = this.generateKey(events);

    this._barriers[key] = {
      events: events.reduce((acc, ev) => ({ ...acc, [ev]: 0 }), {}),
      callbacks: this._barriers[key]
        ? [...this._barriers[key].callbacks, { callback, context }]
        : [{ callback, context }],
    };

    // tslint:disable-next-line max-line-length
    this._lookups = events.reduce((acc, ev) => Object.assign(acc, { [ev]: this._lookups[ev] ? [...this._lookups[ev], key] : [key] }), this._lookups);

    return this;
  }

  allOff(events: string[], callback: () => void) {
    const key = this.generateKey(events);
    const barrier = this._barriers[key];

    if (barrier) {
      barrier.callbacks = barrier.callbacks.filter(({ callback: fn }) => fn !== callback);

      if (!barrier.callbacks.length) {
        delete this._barriers[key];
      }

      events.forEach((ev) => {
        this._lookups[ev] = this._lookups[ev].filter((k) => k !== key);

        if (!this._lookups[ev].length) {
           delete this._lookups[ev];
        }
      });
    }

    return this;
  }

  generateKey(events: string[]) {
    return events.slice(0).sort().join(':');
  }
}

export interface Events {
  [key: string]: number;
}

export interface Listener {
 context: any;
 callback: () => void;
}

export interface Barrier {
  events: Events;
  callbacks: Listener[];
}

export interface Barriers {
  [key: string]: Barrier;
}

export interface Lookups {
  [key: string]: string[];
}

export default Emitter;
