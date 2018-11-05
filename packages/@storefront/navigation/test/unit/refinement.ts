import { Selectors } from '@storefront/core';
import Refinement from '../../src/refinement';
import suite from './_suite';

suite('Refinement', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let refinement: Refinement;

  beforeEach(() => (refinement = new Refinement()));

  itShouldProvideAlias(Refinement, 'refinementDisplay');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial values', () => {
        expect(refinement.props).to.eql({ alwaysShowTotal: false });
      });
    });
  });

  describe('init()', () => {
    it('should set state', () => {
      const total = 1024;
      const updateState = (refinement.updateState = spy());

      refinement.init();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should update the total', () => {
      const total = 1024;
      const updateState = (refinement.updateState = spy());

      refinement.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    beforeEach(() => {
      refinement.select = () => 1000;
    });

    describe('state.total', () => {
      it('should get the total from props if it exists', () => {
        const total = 1024;
        refinement.props = <any>{ total };
        refinement.state = {};

        refinement.updateState();

        expect(refinement.state.total).to.eq(total);
      });

      it('should return the record count if the refinement is selected and not or-able', () => {
        const count = 1024;
        refinement.select = () => count;
        refinement.props = <any>{ or: false, selected: true };

        refinement.updateState();

        expect(refinement.state.total).to.eql(count);
      });
    });

    describe('state.showTotal', () => {
      const truthTable = [
        { total: 0, alwaysShowTotal: false, selected: false, or: false, expected: false },
        { total: 0, alwaysShowTotal: false, selected: false, or: true, expected: false },
        { total: 0, alwaysShowTotal: false, selected: true, or: false, expected: false },
        { total: 0, alwaysShowTotal: false, selected: true, or: true, expected: false },
        { total: 0, alwaysShowTotal: true, selected: false, or: false, expected: false },
        { total: 0, alwaysShowTotal: true, selected: false, or: true, expected: false },
        { total: 0, alwaysShowTotal: true, selected: true, or: false, expected: false },
        { total: 0, alwaysShowTotal: true, selected: false, or: true, expected: false },
        { total: 0, alwaysShowTotal: true, selected: true, or: false, expected: false },
        { total: 0, alwaysShowTotal: true, selected: true, or: true, expected: false },
        { total: 1, alwaysShowTotal: false, selected: false, or: false, expected: true },
        { total: 1, alwaysShowTotal: false, selected: false, or: true, expected: true },
        { total: 1, alwaysShowTotal: false, selected: true, or: false, expected: false },
        { total: 1, alwaysShowTotal: false, selected: true, or: true, expected: false },
        { total: 1, alwaysShowTotal: true, selected: false, or: false, expected: true },
        { total: 1, alwaysShowTotal: true, selected: false, or: true, expected: true },
        { total: 1, alwaysShowTotal: true, selected: true, or: false, expected: true },
        { total: 1, alwaysShowTotal: true, selected: true, or: true, expected: true },
      ];

      truthTable.forEach(({ total, alwaysShowTotal, selected, or, expected }) => {
        it(`should return ${expected} for total: ${
          total ? '>0' : '0'
        }, alwaysShowTotal: ${alwaysShowTotal}, selected: ${selected}, or: ${or}`, () => {
          refinement.props = { total, alwaysShowTotal, selected, or };
          refinement.state = {};
          refinement.select = () => total;

          refinement.updateState();

          expect(refinement.state.showTotal).to.eq(expected);
        });
      });
    });

    describe('state.label', () => {
      it('should return the value', () => {
        const value = 'value';
        refinement.props = { range: false, value };

        refinement.updateState();

        expect(refinement.state.label).to.eq(value);
      });

      it('should return a range', () => {
        refinement.props = {
          range: true,
          low: 4,
          high: 10,
        };

        refinement.updateState();

        expect(refinement.state.label).to.eq('4 - 10');
      });
    });

    describe('state.orType', () => {
      it('should return "checkbox" for or-able refinement', () => {
        refinement.props = { or: true };

        refinement.updateState();

        expect(refinement.state.orType).to.eq('checkbox');
      });

      it('should return "button" for non-or-able refinement', () => {
        refinement.props = { or: false };

        refinement.updateState();

        expect(refinement.state.orType).to.eq('button');
      });
    });

    describe('state.cancelDisplay', () => {
      const truthTable = [
        { or: false, selected: false, expected: false },
        { or: false, selected: true, expected: true },
        { or: true, selected: false, expected: false },
        { or: true, selected: true, expected: false },
      ];

      truthTable.forEach(({ or, selected, expected }) => {
        it(`should return ${expected} for or: ${or}, selected: ${selected}`, () => {
          refinement.props = { or, selected };

          refinement.updateState();

          expect(refinement.state.cancelDisplay).to.eq(expected);
        });
      });
    });
  });

  describe('onClick()', () => {
    it('should set preventUpdate', () => {
      const event: any = {};
      refinement.props = {} as any;

      refinement.onClick(event);

      expect(event.preventUpdate).to.be.true;
    });

    it('should call props.onClick()', () => {
      const onClick = spy();
      refinement.props = <any>{ onClick };

      refinement.onClick(<any>{});

      expect(onClick).to.be.called;
    });
  });

});
