import { EventEmitter } from 'eventemitter3';
import * as sinon from 'sinon';
import Emitter from '../../../src/core/emitter';
import Events from '../../../src/core/events';
import * as utils from '../../../src/core/utils';
import suite from '../_suite';

suite('Emitter', ({ expect, spy, stub }) => {
  let emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  describe('constructor()', () => {
    it('should extend EventEmitter', () => {
      expect(emitter).to.be.an.instanceOf(EventEmitter);
    });

    it('should set _barriers and _lookups', () => {
      expect(emitter._barriers).to.eql({});
      expect(emitter._lookups).to.eql({});
    });
  });

  describe('all()', () => {
    it('should set the _barriers object with the events and callback', () => {
      const events = ['a', 'b'];
      const callback = () => null;

      emitter.all(events, callback);

      expect(emitter._barriers['a:b']).to.eql({ events: { a: 0, b: 0 }, callbacks: [{ callback, context: emitter }] });
    });

    it('should set the _lookups object with the event names', () => {
      const events = ['a', 'b'];
      const key = 'a:b';

      emitter.all(events, () => ({}));

      expect(emitter._lookups).to.eql({ a: [key], b: [key] });
    });

    it('should update the callbacks array when an event already exists in _barriers', () => {
      const events = ['a', 'b'];
      const callback1 = () => null;
      const callback2 = () => null;

      emitter.all(events, callback1);
      emitter.all(events, callback2);

      expect(emitter._barriers['a:b']).to.eql({
        events: { a: 0, b: 0 },
        callbacks: [
          { callback: callback1, context: emitter },
          { callback: callback2, context: emitter }
        ]
      });
    });

    it('should sort the events before generating the key', () => {
      const events1 = ['a', 'b'];
      const events2 = ['b', 'a'];
      const key = 'a:b';

      emitter.all(events1, () => null);
      emitter.all(events2, () => null);

      expect(emitter._barriers[key].callbacks).to.have.length(2);
    });

    it('should update the _lookups array with a new key', () => {
      const events1 = ['a', 'b'];
      const events2 = ['a', 'c'];
      const key = 'a:b';
      const key2 = 'a:c';

      emitter.all(events1, () => ({}));
      emitter.all(events2, () => ({}));

      expect(emitter._lookups).to.eql({ a: [key, key2], b: [key], c: [key2] });
    });

    it('should allow the context to be specified' , () => {
      const events1 = ['a', 'b'];
      const key = 'a:b';
      const callback = () => ({});
      const that = { c: 'd' };

      emitter.all(events1, callback, that);

      expect(emitter._barriers[key]).to.eql({ events: { a: 0, b: 0 }, callbacks: [{ callback, context: that }] });
    });

    it('should return the emitter' , () => {
      expect(emitter.all(['a', 'b', 'c'], () => null)).to.eq(emitter);
    });

    it('should ignore empty arrays', () => {
      emitter.all([], () => null);
      expect(emitter._barriers).to.eql({});
      expect(emitter._lookups).to.eql({});
    });

    it('should not register duplicate keys', () => {
      const events = ['a', 'b'];
      const key = 'a:b';
      emitter._lookups = { a: [key], b: [key] };
      emitter._barriers = {
        [key]: {
          events: { a: 0, b: 0 },
          callbacks: [{ callback: () => null, context: emitter }],
        }
      };

      emitter.all(events, () => null);

      expect(emitter._lookups[events[0]]).to.eql([key]);
      expect(emitter._lookups[events[1]]).to.eql([key]);
    });

    it('should not reset the event counters', () => {
      const events = ['a', 'b'];
      const key = 'a:b';
      emitter._lookups = { a: [key], b: [key] };
      emitter._barriers = {
        [key]: {
          events: {
            a: 0,
            b: 420,
          },
          callbacks: [{ callback: () => null, context: emitter }],
        },
      };

      emitter.all(events, () => null);

      expect(emitter._barriers[key].events).to.eql({ a: 0, b: 420 });
    });
  });

  describe('allOff', () => {
    it('should remove the target callback', () => {
      const events = ['a', 'b'];
      const key = 'a:b';
      const callback1 = () => null;
      const callback2 = () => null;
      emitter._lookups = { a: [key], b: [key] };
      emitter._barriers[key] = {
        callbacks: [
          { callback: callback1, context: emitter },
          { callback: callback2, context: emitter }
        ]
      };

      emitter.allOff(events, callback1);

      expect(emitter._barriers[key].callbacks).to.eql([{ callback: callback2, context: emitter }]);
    });

    it('should not affect unrelated barriers', () => {
      const events1 = ['a', 'b'];
      const events2 = ['b', 'c'];
      const key2 = 'b:c';
      const callback = spy();
      emitter.all(events1, callback);
      emitter.all(events2, callback);

      emitter.allOff(events1, callback);

      expect(emitter._barriers[key2]).to.eql({
        events: { b: 0, c: 0 },
        callbacks: [{ callback, context: emitter }],
      });
    });

    it('should return the emitter', () => {
      expect(emitter.allOff(['a', 'b', 'c'], () => null)).to.eq(emitter);
    });

    it('should remove the _lookups and _barriers keys if all callbacks have been removed', () => {
      const events = ['a', 'b'];
      const key = 'a:b';
      const callback = spy();
      emitter._lookups = { a: [key], b: [key] };
      emitter._barriers = {
        [key]: {
          events: { a: 0, b: 0 },
          callbacks: [{ callback, context: emitter }]
        }
      };

      emitter.allOff(events, callback);

      expect(emitter._lookups).to.eql({});
      expect(emitter._barriers).to.eql({});
    });

    it('should not remove the key from the _lookups table if one or more callbacks remain', () => {
      const events = ['a', 'b'];
      const key = 'a:b';
      const callback1 = () => null;
      const callback2 = () => null;
      emitter._lookups = { a: [key], b: [key] };
      emitter._barriers = {
        [key]: {
          events: { a: 0, b: 0 },
          callbacks: [
            { callback: callback1, context: emitter },
            { callback: callback2, context: emitter },
          ],
        },
      };

      emitter.allOff(events, callback2);

      expect(emitter._lookups[events[0]]).to.eql([key]);
      expect(emitter._lookups[events[1]]).to.eql([key]);
      expect(emitter._barriers[key]).to.eql({
        events: { a: 0, b: 0 },
        callbacks: [{ callback: callback1, context: emitter }],
      });
    });
  });

  describe('emit', () => {
    it('should update the _barriers counters if they exist', () => {
      const events = ['a', 'b'];
      const key = 'a:b';

      emitter.all(events, () => null);
      emitter.emit('a', null);

      expect(emitter._barriers[key].events.a).to.equal(1);
    });

    it('should invoke the callbacks if each event in a given collection has been emitted at least once', () => {
      const events = ['a', 'b'];
      const callback1 = spy();
      const callback2 = spy();

      emitter.all(events, callback1);
      emitter.all(events, callback2);
      events.forEach((ev) => emitter.emit(ev, null));

      expect(callback1).to.have.been.called;
      expect(callback2).to.have.been.called;
    });

    it('should reset the event counters for a given collection', () => {
      const events = ['a', 'b'];
      const key = 'a:b';
      const callback = spy();

      emitter.all(events, callback);
      events.forEach((ev) => emitter.emit(ev, null));

      expect(Object.keys(emitter._barriers[key].events).map((k) => emitter._barriers[key].events[k])).to.eql([0, 0]);
    });

    it('should invoke the callback with the correct context', () => {
      const events = ['a', 'b'];
      const callback = spy();
      const that = { a: 'b' };

      emitter.all(events, callback, that);
      emitter.emit('a', null);
      emitter.emit('b', null);

      expect(callback.thisValues[0]).to.eql(that);
    });
  });

  describe('generateKey', () => {
    it('should generate a sorted barrier key', () => {
      const events = ['c', 'd', 'a', 'z'];

      const key = emitter.generateKey(events);

      expect(key).to.equal('a:c:d:z');
    });
  });
});
