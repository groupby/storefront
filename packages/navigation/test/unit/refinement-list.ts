import * as sinon from 'sinon';
import RefinementList from '../../src/refinement-list';
import suite from './_suite';

suite('RefinementList', ({ expect, spy, stub }) => {
  let refinementList: RefinementList;

  beforeEach(() => (refinementList = new RefinementList()));

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(refinementList.props).eql(<any>{ refinements: [], itemProps: {} });
      });
    });
  });

  describe('get alias()', () => {
    it('should return alias name', () => {
      expect(refinementList.alias).to.eq('refinements');
    });
  });

  describe('init()', () => {
    it('should provide refinements', () => {
      const provide = (refinementList.provide = spy());
      const refinements: any = ['a', 'b'];
      const alias = 'c';
      stub(refinementList, 'alias').get(() => alias);
      refinementList.props = { refinements };

      refinementList.init();

      expect(provide).to.be.calledWithExactly(alias, sinon.match.func);
    });
  });
});
