import RangeSelector from '../../src/range-selector';
import RefinementControls from '../../src/refinement-controls';
import suite from './_suite';

suite('RangeSelector', ({ expect, spy, stub }) => {
  let rangeSelector: RangeSelector;

  beforeEach(() => rangeSelector = new RangeSelector());

  describe('onClick()', () => {
    const field = 'NavigationField';
    const max = 1000;
    const min = 10;
    let switchRefinement;

    beforeEach(() => switchRefinement = spy());

    it('should call switchRefinement with field, low, and high', () => {
      const high = 500;
      const low = 300;
      rangeSelector.props = {
        values: {
          high,
          low,
          max,
          min
        },
        field
      };
      rangeSelector.actions = <any>{
        switchRefinement
      };

      rangeSelector.onClick();

      expect(switchRefinement).to.be.calledWithExactly(field, low, high);
    });

    it('should call switchRefinement with field, high, and low', () => {
      const high = 100;
      const low = 300;
      rangeSelector.props = {
        values: {
          high,
          low,
          max,
          min
        },
        field
      };
      rangeSelector.actions = <any>{
        switchRefinement
      };

      rangeSelector.onClick();

      expect(switchRefinement).to.be.calledWithExactly(field, high, low);
    });

    it('should call switchRefinement with field, min, and max', () => {
      const high = 1010;
      const low = 5;
      rangeSelector.props = {
        values: {
          high,
          low,
          max,
          min
        },
        field
      };
      rangeSelector.actions = <any>{
        switchRefinement
      };

      rangeSelector.onClick();

      expect(switchRefinement).to.be.calledWithExactly(field, min, max);
    });

    it('should not call switchRefinement with high NaN', () => {
      const high = NaN;
      const low = 5;
      rangeSelector.props = {
        values: {
          high,
          low,
        },
      };
      rangeSelector.actions = <any>{
        switchRefinement
      };

      rangeSelector.onClick();

      expect(switchRefinement).to.not.be.called;
    });
  });
});
