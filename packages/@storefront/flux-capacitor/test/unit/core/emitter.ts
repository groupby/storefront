import { EventEmitter } from 'eventemitter3';
import * as sinon from 'sinon';
import Emitter from '../../../src/core/emitter';
import Events from '../../../src/core/events';
import * as utils from '../../../src/core/utils';
import suite from '../_suite';

suite('Emitter', ({ expect, spy, stub }) => {
  let emitter;
  const invalidInputs = [
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
      key1 = 'a\nb';
      key2 = 'a\nc';
      callback1 = spy();
      callback2 = spy();
    });

    it('should return the emitter' , () => {
      expect(emitter.all(['a', 'b', 'c'], () => null)).to.eq(emitter);
    });

    invalidInputs.forEach((val) => {
      it(`should throw an error when \`events\` is ${val}`, () => {
        expect(() => emitter.all(val , () => null)).to.throw();
      });
    });

    it('should ignore empty arrays', () => {
      const result = emitter.all([], () => null);

      expect(emitter._barriers).to.eql({});
      expect(emitter._lookups).to.eql({});
      expect(result).to.eql(emitter);
    });

    it('should set the _barriers and _lookups objects with the events and callback', () => {
      emitter.all(events1, callback1);

      expect(emitter._lookups[events1[0]]).to.eql([key1]);
      expect(emitter._lookups[events1[1]]).to.eql([key1]);
      expect(emitter._barriers[key1]).to.eql([{
        callback: callback1,
        context: emitter,
        events: { a: 0, b: 0 },
      }]);
    });

    it('should allow the context to be specified' , () => {
      const that = { c: 'd' };

      emitter.all(events1, callback1, that);

      expect(emitter._barriers[key1]).to.eql([{
        callback: callback1,
        context: that,
        events: { a: 0, b: 0 },
      }]);
    });

    it('should update the callbacks array when an event already exists in _barriers', () => {
      emitter.all(events1, callback1);
      emitter.all(events1, callback2);

      expect(emitter._barriers[key1]).to.eql([
        { callback: callback1, context: emitter, events: { a: 0, b: 0 } },
        { callback: callback2, context: emitter, events: { a: 0, b: 0 } },
      ]);
    });

    it('should sort the events before generating the key', () => {
      emitter.all(events1, callback1);
      emitter.all(events1.reverse(), callback2);

      expect(emitter._barriers[key1]).to.have.length(2);
    });

    it('should update the _lookups object with a new key', () => {
      emitter.all(events1, callback1);
      emitter.all(events2, callback2);

      expect(emitter._lookups).to.eql({ a: [key1, key2], b: [key1], c: [key2] });
    });

    it('should not register duplicate keys', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: [{
          callback: callback1,
          context: emitter,
          events: { a: 0, b: 0 },
        }],
      };

      emitter.all(events1, callback2);

      expect(emitter._lookups[events1[0]]).to.eql([key1]);
      expect(emitter._lookups[events1[1]]).to.eql([key1]);
    });

    it('should not reset the event counters', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: [{
          callback: callback1,
          context: emitter,
          events: { a: 0, b: 420 },
        }],
      };

      emitter.all(events1, callback2);

      expect(emitter._barriers[key1][0].events).to.eql({ a: 0, b: 420 });
    });
  });

  describe('allOff', () => {
    let events1;
    let events2;
    let key1;
    let key2;
    let callback1;
    let callback2;

    beforeEach(() => {
      events1 = ['a', 'b'];
      events2 = ['a', 'c'];
      key1 = 'a\nb';
      key2 = 'a\nc';
      callback1 = spy();
      callback2 = spy();
    });

    it('should return the emitter', () => {
      expect(emitter.allOff(['a', 'b', 'c'], () => null)).to.eq(emitter);
    });

    invalidInputs.forEach((val) => {
      it(`should throw an error when \`events\` is ${val}`, () => {
        expect(() => emitter.allOff(val , () => null)).to.throw();
      });
    });

    it('should remove the target callback', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: [
          { callback: callback1, context: emitter, events: { a: 0, b: 0 } },
          { callback: callback2, context: emitter, events: { a: 0, b: 0 } },
        ],
      };

      emitter.allOff(events1, callback1);

      expect(emitter._barriers[key1]).to.eql([{
        callback: callback2,
        context:
        emitter, events: { a: 0, b: 0 }
      }]);
    });

    it('should not affect unrelated barriers', () => {
      emitter.all(events1, callback1);
      emitter.all(events2, callback2);

      emitter.allOff(events1, callback1);

      expect(emitter._barriers[key2]).to.eql([{
        callback: callback2,
        context: emitter,
        events: { a: 0, c: 0 },
      }]);
    });

    it('should remove the _lookups and _barriers keys if all callbacks have been removed', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: [{
          callback: callback1,
          context: emitter,
          events: { a: 0, b: 0 },
        }],
      };

      emitter.allOff(events1, callback1);

      expect(emitter._lookups).to.eql({});
      expect(emitter._barriers).to.eql({});
    });

    it('should not remove the key from the _lookups object if one or more callbacks remain', () => {
      emitter._lookups = { a: [key1], b: [key1] };
      emitter._barriers = {
        [key1]: [
          { callback: callback1, context: emitter, events: { a: 0, b: 0 } },
          { callback: callback2, context: emitter, events: { a: 0, b: 0 } },
        ],
      };

      emitter.allOff(events1, callback2);

      expect(emitter._lookups[events1[0]]).to.eql([key1]);
      expect(emitter._lookups[events1[1]]).to.eql([key1]);
      expect(emitter._barriers[key1]).to.eql([{
        callback: callback1,
        context: emitter,
        events: { a: 0, b: 0 },
      }]);
    });
  });

  describe('emit', () => {
    let events1;
    let key1;
    let callback1;
    let callback2;

    beforeEach(() => {
        events1 = ['a', 'b'];
        key1 = 'a\nb';
        callback1 = spy();
        callback2 = spy();
    });

    it('should update the _barriers counters if they exist', () => {
      emitter.all(events1, () => null);
      emitter.emit('a', null);

      expect(emitter._barriers[key1][0].events.a).to.eq(1);
    });

    it('should invoke the callbacks if each event in a given collection has been emitted at least once', () => {
      emitter.all(events1, callback1);
      emitter.all(events1, callback2);
      events1.forEach((ev) => emitter.emit(ev, null));

      expect(callback1).to.have.been.called;
      expect(callback2).to.have.been.called;
    });

    it('should reset the event counters for a given collection', () => {
      emitter.all(events1, callback1);
      events1.forEach((ev) => emitter.emit(ev, null));

      expect(Object.keys(emitter._barriers[key1][0].events).map((k) => emitter._barriers[key1][0].events[k])).to.eql([0, 0]);
    });

    it('should invoke the callback with the correct context', () => {
      const that = { a: 'b' };

      emitter.all(events1, callback1, that);
      emitter.emit('a', null);
      emitter.emit('b', null);

      expect(callback1.thisValues[0]).to.eql(that);
    });
  });

  describe('generateKey', () => {
    it('should generate a sorted barrier key', () => {
      const events = ['c', 'd', 'a', 'z'];

      const key = emitter.generateKey(events);

      expect(key).to.eq('a\nc\nd\nz');
    });
  });
});
