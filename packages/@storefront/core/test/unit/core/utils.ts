import * as GbTracker from 'gb-tracker-client/slim';
import * as deepAssign from 'lodash.merge';
import * as log from 'loglevel';
import * as riot from 'riot';
import * as sinon from 'sinon';
import Tag, { TAG_DESC, TAG_META } from '../../../src/core/tag';
import * as utils from '../../../src/core/utils';
import suite from '../_suite';

suite('utils', ({ expect, spy, stub }) => {
  it('should include repackaged utilty functions', () => {
    expect(utils.deepAssign).to.eq(deepAssign);
    expect(utils.log).to.eq(log);
    expect(utils.riot).to.eq(riot);
    expect(utils.GbTracker).to.eq(GbTracker);
  });

  it('should expose a table of DOM key strings', () => {
    expect(Object.keys(utils.KEYS).every((k) => typeof utils.KEYS[k] === 'string')).to.be.true;
  });

  describe('deepAssign()', () => {
    it('should allow functions to override objects', () => {
      const myObj = () => null;

      expect(deepAssign({ myObj: {}, a: 'b' }, { myObj })).to.eql({ myObj, a: 'b' });
    });
  });

  describe('dot', () => {
    describe('get()', () => {
      it('should return nested value', () => {
        const obj = { a: { bcd: [{}, { 5: { name: [{ '%valu!': 'e' }] } }] } };

        expect(utils.dot.get(obj, 'a.bcd.1.5.name.0.%valu!')).to.eq('e');
      });

      it('should return nested value with simplified array notation (no quotes for keys)', () => {
        const obj = { a: { bcd: [{}, { 5: { name: [{ '%valu!': 'e' }] } }] } };

        expect(utils.dot.get(obj, 'a.bcd[1][5].name[0].%valu!')).to.eq('e');
      });

      it('should return default value if no nested value found', () => {
        const defaultValue = 'mark';
        const obj = { a: { bcd: [{}, { 5: { name: [{ '%valu!': 'e' }] } }] } };

        expect(utils.dot.get(obj, 'a.bcd.1.5.name.0.%valur!', defaultValue)).to.eq(defaultValue);
      });

      it('should bail out if path is invalid', () => {
        const defaultValue = 'mark';
        const obj = { a: { bcd: [{}, { 5: { name: [{ '%valu!': 'e' }] } }] } };

        expect(utils.dot.get(obj, 'a.bcd.label.ha.3', defaultValue)).to.eq(defaultValue);
      });
    });
  });

  describe('mapToSearchActions()', () => {
    it('should turn links into flux actions', () => {
      const search = spy();
      const values: any[] = ['a', 'b'];

      const mapped = utils.mapToSearchActions(values, <any>{ search });

      expect(mapped[0]).to.have.keys('value', 'onClick');
      expect(mapped[1]).to.have.keys('value', 'onClick');

      mapped[1].onClick();

      expect(search).to.be.calledWith('b');
    });
  });

  describe('rayify()', () => {
    it('should return the value in an array', () => {
      expect(utils.rayify('a')).to.eql(['a']);
    });

    it('should return the original array', () => {
      const value = ['v'];

      expect(utils.rayify(value)).to.eq(value);
    });
  });

  describe('WINDOW()', () => {
    const win = {};
    let oldWindow = global['window'];

    beforeEach(() => global['window'] = win);
    afterEach(() => global['window'] = oldWindow);

    it('should return global window object', () => {
      expect(utils.WINDOW()).to.eq(win);
    });
  });

  describe('arrayToDotNotation()', () => {
    it('should throw error with throw error flag on with non-string input', () => {
      expect(() => utils.arrayToDotNotation(<any>1)).to.throw('input not a string');
    });

    it('should return correct dot notation version', () => {
      expect(utils.arrayToDotNotation('henlo[2][1].b[3]')).to.eql('henlo.2.1.b.3');
    });

    it('should should not modify string if entirely dot notation to begin with', () => {
      const input = 'henlo.a.1.b.a';

      expect(utils.arrayToDotNotation(input)).to.eql(input);
    });
  });
});
