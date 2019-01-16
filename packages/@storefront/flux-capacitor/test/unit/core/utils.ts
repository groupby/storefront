import SearchAdapter from '../../../src/core/adapters/search';
import Selectors from '../../../src/core/selectors';
import * as utils from '../../../src/core/utils';
import suite from '../_suite';

const ACTION = 'MY_ACTION';

suite('utils', ({ expect, spy, stub }) => {

  describe('rayify()', () => {
    it('should return an array if the argument is a value', () => {
      expect(utils.rayify(20)).to.eql([20]);
      expect(utils.rayify('apple')).to.eql(['apple']);
      expect(utils.rayify({ a: 'b' })).to.eql([{ a: 'b' }]);
      expect(utils.rayify(true)).to.eql([true]);
    });

    it('should return the original argument if it is an array', () => {
      const array = [{ a: 'b' }, { c: 'd' }];

      expect(utils.rayify(array)).to.eq(array);
    });
  });

  describe('sortBasedOn()', () => {
    it('should sort array based on basis array', () => {
      const firstArray = [1, 5, 2, 3, 9];
      const secondArray = [5, 3, 8];

      expect(utils.sortBasedOn(firstArray, secondArray)).to.eql([5, 3, 1, 2, 9]);
    });

    it('should sort array based on basis array and cb', () => {
      const firstArray = [{ value: 1 }, { value: 3 }, { value: 5 }, { value: 2 }, { value: 9 }];
      const secondArray = [{ value: 5 }, { value: 3 }, { value: 8 }];
      const comparison = (first, second) => first.value === second.value;

      expect(utils.sortBasedOn(firstArray, secondArray, comparison)).to.eql([
        { value: 5 },
        { value: 3 },
        { value: 1 },
        { value: 2 },
        { value: 9 }
      ]);
    });
  });

  describe('normalizeToFunction()', () => {
    it('should return the given argument if its a function', () => {
      const fn = (r) => r;

      expect(utils.normalizeToFunction(fn)).to.eq(fn);
    });

    it('should return a function that mixes the given argument in a given object', () => {
      const o = { a: 'b' };
      const o2: any = { c: 'd' };

      expect(utils.normalizeToFunction(o)(o2)).to.eql({ ...o2, ...o });
    });
  });

  describe('filterState()', () => {
    // tslint:disable-next-line max-line-length
    it('should filter config from state and remove products, navigations, templates, and autocomplete data when history length is 0', () => {
      const data = {
        a: 'b',
        past: [{ a: 'b' }],
        present: {
          products: [{ c: 'd' }, { e: 'f' }],
          navigations: { a: 'b', allIds: [1,2,3], byId: { j: 'k' }, sort: { d: 'e' } },
          template: { y: 'z' },
          autocomplete: {
            navigations: ['a', 'b', 'c'],
            products: [{ d: 'e' }],
            template: { f: 'g' },
          },
        },
      };
      const payload = { e: 'f' };
      const fullPayload = { ...payload, method: () => null };
      const config = { history: { length: 0 } };
      const session = { a: 'b', c: 'd' };
      const sessionWithConfig = { ...session, config };
      const otherData = {
        e: 'f',
        j: { h: 1 },
        o: [2, 3, 4],
        n: { i: 'r', k: {} },
      };
      const state: any = { ...otherData, session: sessionWithConfig, data };
      Object.freeze(state);
      Object.freeze(session);
      Object.freeze(sessionWithConfig);

      const stateWithoutConfig = utils.filterState(state, fullPayload);

      expect(stateWithoutConfig).to.eql({
        ...otherData,
        session,
        data: {
          ...data,
          past: [],
          present: {
            history: payload,
            autocomplete: { navigations: [], products: [], template: {} },
            products: [],
            navigations: { allIds: [], byId: {}, sort: [] },
            template: {},
          },
        },
      });
    });

    it('should filter config from state without modifying state', () => {
      const config = { history: { length: 5 } };
      const session = { a: 'b', c: 'd' };
      const sessionWithConfig = { ...session, config };
      const payload = { e: 'f' };
      const fullPayload = { method: () => null, ...payload };
      const otherData = {
        e: 'f',
        j: {
          h: 1,
        },
        o: [2, 3, 4],
        n: {
          i: 'r',
          k: {},
        },
        data: {
          past: [{ a: 'b' }],
          present: {
            history: { g: 'h' },
            products: [{ c: 'd' }],
            navigations: { a: 'b', allIds: [1,2,3], byId: { j: 'k' }, sort: { d: 'e' } },
            template: { y: 'z' },
            autocomplete: { navigations: [], products: [], template: {} },
          },
        },
      };
      const state: any = { ...otherData, session: sessionWithConfig };
      Object.freeze(state);
      Object.freeze(session);
      Object.freeze(sessionWithConfig);

      const stateWithoutConfig = utils.filterState(state, fullPayload);

      expect(stateWithoutConfig).to.eql({
        ...otherData,
        session,
        data: {
          ...otherData.data,
          past: [],
          present: {
            ...otherData.data.present,
            history: { ...otherData.data.present.history, ...payload },
          }
        },
      });
    });
  });
});
