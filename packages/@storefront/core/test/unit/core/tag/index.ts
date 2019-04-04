import * as sinon from 'sinon';
import Tag, { TAG_DESC, TAG_META } from '../../../../src/core/tag';
// import Alias from '../../../../src/core/tag/alias';
// import * as aliasing from '../../../../src/core/tag/alias';
// import Lifecycle from '../../../../src/core/tag/lifecycle';
import TagUtils from '../../../../src/core/tag/utils';
import * as utils from '../../../../src/core/utils';
import suite from '../../_suite';
import Phase from '../../../../src/core/tag/phase';

suite('Tag', ({ expect, spy, stub }) => {
  let tag: any;

  beforeEach(() => {
    tag = new Tag();
  });

  describe('Base Tag', () => {
    // let tagAlias: Alias;
    let alias: sinon.SinonStub;
    let lifecycleAttach: sinon.SinonStub;
    let attach: sinon.SinonSpy;

    describe('set()', () => {
      it('should call update with state directly if state is true', () => {
        const update = (tag.update = spy());

        tag.set(true);

        expect(update).to.be.calledWithExactly(true);
      });

      it('should update the state', () => {
        const update = (tag.update = spy());
        tag.state = { a: 'b' };

        tag.set({ c: 'd' });

        expect(update).to.be.calledWithExactly({ state: { a: 'b', c: 'd' } });
      });
    });

    describe('select()', () => {
      it('should call selector with state and varargs', () => {
        const state = { a: 'b' };
        const args = [{ c: 'd' }, { e: 'f' }];
        const selector = spy();
        tag.flux = <any>{ store: { getState: () => state } };

        tag.select(selector, ...args);

        expect(selector).to.be.calledWithExactly(state, ...args);
      });
    });

    describe('dispatch()', () => {
      it('should dispatch an action to flux.store', () => {
        const dispatch = spy();
        const action: any = { a: 'b' };
        tag.flux = <any>{ store: { dispatch } };

        tag.dispatch(action);

        expect(dispatch).to.be.calledWithExactly(action);
      });
    });

    describe('provide()', () => {
      it('should expose the provided resolver', () => {
        const name = 'thing1';
        const resolver = spy();
        const props = { a: 'b' };
        const state = { c: 'd' };
        const aliases = { e: 'f' };

        tag.provide(name, resolver);
        tag._provides[name](props, state)(aliases);

        expect(resolver).to.be.calledWith(props, state, aliases);
      });

      it('should return state if no resolver provided', () => {
        const name = 'thing1';
        const props = { a: 'b' };
        const state = { c: 'd' };
        const aliases = { e: 'f' };

        tag.provide(name);
        const result = tag._provides[name](props, state)(aliases);

        expect(result).to.eq(state);
      });

      it('should throw error if provided resolver is not a function', () => {
        const name = 'thing1';

        const thunk = () => {
          tag.provide(name, 'not a fxn');
        };

        expect(thunk).to.throw();
      });

      it('should throw error if tag has been initialized', () => {
        const name = 'thing1';
        tag.isInitialized = true;

        const thunk = () => {
          tag.provide(name);
        };

        expect(thunk).to.throw();
      });
    });
  });

  describe('create()', () => {
    it('should call riot.tag()', () => {
      const tag = spy();
      const clazz: any = () => null;
      const metadata = { c: 'd' };
      const bindController = stub(TagUtils, 'bindController');
      const readClassDecorators = stub(TagUtils, 'tagDescriptors').returns(['a', 'b']);
      const getDescription = stub(Tag, 'getDescription').returns({ metadata });

      Tag.create({ tag })(clazz);

      expect(readClassDecorators).to.be.calledWithExactly(clazz);
      expect(tag).to.be.calledWithExactly(
        'a',
        'b',
        sinon.match((cb) => {
          const instance = new cb();

          expect(instance[TAG_META]).to.eql(metadata);
          expect(getDescription).to.be.calledWithExactly(clazz);
          return expect(bindController).to.be.calledWithExactly(sinon.match.any, clazz);
        })
      );
    });
  });

  describe('mixin()', () => {
    it('should add properties from app', () => {
      const services = { a: 'b' };
      const config = { c: 'd' };

      const mixin = Tag.mixin(<any>{ services, config });

      expect(mixin.services).to.eq(services);
      expect(mixin.config).to.eq(config);
    });

    // it('should create initialization method', () => {
    //   const tag = {};
    //   const convertToMixin = stub(TagUtils, 'convertToMixin');
    //   const mixin = Tag.mixin(<any>{});
    //
    //   expect(convertToMixin).to.be.calledWithExactly(Tag);
    // });
  });

  describe('getMeta()', () => {
    it('should extract meta', () => {
      const meta = { a: 'b' };
      const tag: any = { [TAG_META]: meta };

      expect(Tag.getMeta(tag)).to.eq(meta);
    });

    it('should have default value', () => {
      expect(Tag.getMeta(<any>{})).to.eql({});
    });
  });

  describe('getDescription()', () => {
    it('should extract description', () => {
      const oldDescription = { a: 'b' };
      const updatedDescription = { c: 'd' };
      const clazz: any = { [TAG_DESC]: oldDescription };
      const setDescription = stub(Tag, 'setDescription').returns(updatedDescription);

      const description = Tag.getDescription(clazz);

      expect(description).to.eq(updatedDescription);
      expect(setDescription).to.be.calledWithExactly(clazz, oldDescription);
    });

    it('should have and set a default value', () => {
      const clazz: any = {};
      const updatedDescription = { a: 'b' };
      const setDescription = stub(Tag, 'setDescription').returns(updatedDescription);

      const description = Tag.getDescription(clazz);

      expect(description).to.eq(updatedDescription);
      expect(setDescription).to.be.calledWithExactly(clazz, { metadata: {} });
    });
  });

  describe('setDescription()', () => {
    it('should update and return description', () => {
      const description: any = { a: 'b' };
      const clazz: any = {};

      expect(Tag.setDescription(clazz, description)).to.eq(description);
      expect(clazz[TAG_DESC]).to.eq(description);
    });
  });

  describe('subscribeWith', () => {
    it('should invoke `flux.all` with the events and callback', () => {
      const events = ['a', 'b', 'c'];
      const all: any = spy();
      const cb = spy();
      tag.flux = { all };
      tag.one = () => null;

      tag.subscribeWith(events, cb);

      expect(all).to.be.calledWith(events, cb);
    });

    it('should update the _lookups array', () => {
      const events = ['a', 'b', 'c'];
      const cb = spy();
      tag.flux = { all: () => null };
      tag.one = () => null;

      tag.subscribeWith(events, cb);

      expect(tag._lookups).to.eql([[events, cb]]);
    });

    it('should register the unmount listener', () => {
      tag.one = spy();
      tag.flux = { all: () => null };
      tag._removeLookups = spy();

      tag.subscribeWith(['a', 'b', 'c'], () => null);

      expect(tag.one).to.be.calledWith(Phase.UNMOUNT, tag._removeLookups);
    });

    it('should not re-register the unmount listener', () => {
      tag.one = spy();
      tag.flux = { all: () => null };
      tag._lookups = [
        [['a', 'b', 'c'], () => null]
      ];

      tag.subscribeWith(['d', 'e', 'f'], () => null);

      expect(tag.one).to.not.be.called;
    });
  });

  describe('_removeEventHandlers()', () => {
    it('should call off for each registered handler', () => {
      const off = spy();
      const eventA = 'a';
      const eventB = 'b';
      const cbA = () => null;
      const cbB = () => null;
      tag._eventHandlers = [
        [eventA, cbA],
        [eventB, cbB],
      ];
      tag.flux = { off };

      tag._removeEventHandlers();

      expect(off).to.be.calledTwice;
      expect(off).to.be.calledWith(eventA, cbA);
      expect(off).to.be.calledWith(eventB, cbB);
    });

    it('should remove all handlers', () => {
      tag._eventHandlers = [
        ['a', () => null],
        ['b', () => null],
        ['c', () => null],
        ['d', () => null],
        ['e', () => null],
      ];
      tag.flux = { off: () => null };

      tag._removeEventHandlers();

      expect(tag._eventHandlers).to.be.empty;
    });
  });

  describe('_removeLookups()', () => {
    it('should call allOff for each lookup', () => {
      const events = ['a', 'b', 'c', 'd', 'e', 'f'];
      const cb = () => null;
      const cb2 = () => null;
      const cb3 = () => null;
      const lookups = tag._lookups = [
        [[events[0], events[1]], cb],
        [[events[2]], cb2],
        [[events[3], events[4], events[5]], cb3]
      ];
      tag.flux = { allOff: spy() };

      tag._removeLookups();

      expect(tag.flux.allOff.args).to.eql(lookups);
    });

    it('should remove all lookups', () => {
      tag._lookups = [
        [['a', 'b'], () => null],
        [['c'], () => null],
        [['d', 'e', 'f'], () => null],
      ];
      tag.flux = { allOff: () => null };

      tag._removeLookups();

      expect(tag._lookups).to.be.empty;
    });
  });
});
