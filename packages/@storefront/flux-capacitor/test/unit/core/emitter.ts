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
    let events1;
    let events2;
    let key1;
    let key2;
    let callback1;
    let callback2;

    beforeEach(() => {
      events1 = ['a','b'];
      events2 = ['a','c'];
      key1 = 'a:b';
      key2 = 'a:c';
      callback1 = spy();
      callback2 = spy();
    });

    it('should return the emitter' , () => {
      expect(emitter.all(['a', 'b', 'c'], () => null)).to.eq(emitter);
    });

    it('should throw an error when `events` is not an array', () => {
      const error = '`events` is not an array.';
      const vals = [
        true,
        false,
        0,
        1,
        null,
        undefined,
        {},
        () => null,
        'Hello, world!',
      ];

      vals.forEach((val) => expect(() => emitter.all(val , () => null)).to.throw(error));
    });

    it('should ignore empty arrays', () => {
      emitter.all([], () => null);

      expect(emitter._barriers).to.eql({});
      expect(emitter._lookups).to.eql({});
    });

    it('should set the _barriers and _lookups objects with the events and callback', () => {
      emitter.all(events1, callback1);

      expect(emitter._lookups[events1[0]]).to.eql([key1]);
      expect(emitter._lookups[events1[1]]).to.eql([key1]);
      expect(emitter._barriers[key1]).to.eql({
        events: { a: 0, b: 0 },
        callbacks: [{ callback: callback1, context: emitter }],
      });
    });

    it('should allow the context to be specified' , () => {
      const that = { c: 'd' };

      emitter.all(events1, callback1, that);

      expect(emitter._barriers[key1]).to.eql({
        events: { a: 0, b: 0 },
        callbacks: [{ callback: callback1, context: that }],
      });
    });

    it('should update the callbacks array when an event already exists in _barriers', () => {
      emitter.all(events1, callback1);
      emitter.all(events1, callback2);

      expect(emitter._barriers[key1]).to.eql({
        events: { a: 0, b: 0 },
        callbacks: [
          { callback: callback1, context: emitter },
          { callback: callback2, context: emitter },
        ],
      });
    });

    it('should sort the events before generating the key', () => {
      emitter.all(events1, callback1);
      emitter.all(events1.reverse(), callback2);

      expect(emitter._barriers[key1].callbacks).to.have.length(2);
    });

    it('should update the _lookups object with a new key', () => {
      emitter.all(events1, callback1);
      emitter.all(events2, callback2);

      expect(emitter._lookups).to.eql({ a: [key1, key2], b: [key1], c: [key2] });
    });

    it('should not register duplicate keys', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: {
          events: { a: 0, b: 0 },
          callbacks: [{ callback: callback1, context: emitter }],
        },
      };

      emitter.all(events1, callback2);

      expect(emitter._lookups[events1[0]]).to.eql([key1]);
      expect(emitter._lookups[events1[1]]).to.eql([key1]);
    });

    it('should not reset the event counters', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: {
          events: { a: 0, b: 420 },
          callbacks: [{ callback: callback1, context: emitter }],
        },
      };

      emitter.all(events1, callback2);

      expect(emitter._barriers[key1].events).to.eql({ a: 0, b: 420 });
    });
  });

  describe('allOff', () => {
    let events1;
    let events2;
    let key1;
    let key2;
    let callback1;
    let callback2;

    before(() => {
      events1 = ['a', 'b'];
      events2 = ['a', 'c'];
      key1 = 'a:b';
      key2 = 'a:c';
      callback1 = spy();
      callback2 = spy();
    });

    it('should return the emitter', () => {
      expect(emitter.allOff(['a', 'b', 'c'], () => null)).to.eq(emitter);
    });

    it('should remove the target callback', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: {
          callbacks: [
            { callback: callback1, context: emitter },
            { callback: callback2, context: emitter },
          ],
        },
      };

      emitter.allOff(events1, callback1);

      expect(emitter._barriers[key1].callbacks).to.eql([{ callback: callback2, context: emitter }]);
    });

    it('should not affect unrelated barriers', () => {
      emitter.all(events1, callback1);
      emitter.all(events2, callback2);

      emitter.allOff(events1, callback1);

      expect(emitter._barriers[key2]).to.eql({
        events: { a: 0, c: 0 },
        callbacks: [{ callback: callback2, context: emitter }],
      });
    });

    it('should remove the _lookups and _barriers keys if all callbacks have been removed', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: {
          events: { a: 0, b: 0 },
          callbacks: [{ callback: callback1, context: emitter }],
        },
      };

      emitter.allOff(events1, callback1);

      expect(emitter._lookups).to.eql({});
      expect(emitter._barriers).to.eql({});
    });

    it('should not remove the key from the _lookups object if one or more callbacks remain', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: {
          events: { a: 0, b: 0 },
          callbacks: [
            { callback: callback1, context: emitter },
            { callback: callback2, context: emitter },
          ],
        },
      };

      emitter.allOff(events1, callback2);

      expect(emitter._lookups[events1[0]]).to.eql([key1]);
      expect(emitter._lookups[events1[1]]).to.eql([key1]);
      expect(emitter._barriers[key1]).to.eql({
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
