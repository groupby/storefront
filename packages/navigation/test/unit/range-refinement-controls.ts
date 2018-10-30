import RangeRefinementControls from '../../src/range-refinement-controls';
import RefinementControls from '../../src/refinement-controls';
import suite from './_suite';

suite('RangeRefinementControls', ({ expect, spy, stub }) => {
  let sliderRefinementControls: RangeRefinementControls;

  beforeEach(() => sliderRefinementControls = new RangeRefinementControls());

  describe('constructor()', () => {
    it('should extend RefinementControls', () => {
      expect(sliderRefinementControls).to.be.an.instanceof(RefinementControls);
    });

    describe('props', () => {
      it('should set initial values', () => {
        expect(sliderRefinementControls.props).to.eql({
          labels: {
            low: 'Min',
            high: 'Max',
            submit: 'Submit'
          }
        });
      });
    });
  });

  describe('alias', () => {
    it('should return alias', () => {
      expect(sliderRefinementControls.alias).to.eq('rangeControls');
    });
  });

  describe('init()', () => {
    it('should update state with low and high from selected', () => {
      sliderRefinementControls.props = <any>{
        navigation: {
          min: 0,
          max: 20,
          refinements: [
            { low: 0, high: 5 },
            { low: 5, high: 10 },
            { low: 10, high: 20 }
          ],
          selected: [2]
        }
      };

      sliderRefinementControls.init();

      expect(sliderRefinementControls.state).to.eql({
        min: 0,
        max: 20,
        low: 10,
        high: 20
      });
    });

    it('should update state with low and high from min and max', () => {
      sliderRefinementControls.props = <any>{
        navigation: {
          min: 0,
          max: 20,
          refinements: [
            { low: 0, high: 5 },
            { low: 5, high: 10 },
            { low: 10, high: 20 }
          ],
          selected: []
        }
      };

      sliderRefinementControls.init();

      expect(sliderRefinementControls.state).to.eql({
        min: 0,
        max: 20,
        low: 0,
        high: 20
      });
    });
  });

  describe('onChange()', () => {
    it('should call updateSelected()', () => {
      const low = { value: 10 };
      const high = { value: 50 };
      const event = <any>{ target: low };
      const lower = { a: 'b' };
      const updateSelected = sliderRefinementControls.updateSelected = spy();
      sliderRefinementControls.tags = <any>{
        'gb-slider': {
          refs: {
            lower
          },
          props: {
            low: low.value
          }
        },
        'gb-range-selector': {
          refs: {
            low,
            high
          }
        }
      };

      sliderRefinementControls.onChange(event);

      expect(updateSelected).to.be.calledWithExactly(low.value, high.value);
    });
  });

  describe('updateSelected()', () => {
    it('should set low and high', () => {
      const low = 50;
      const high = 80;
      const set = sliderRefinementControls.set = spy();

      sliderRefinementControls.updateSelected(low, high);

      expect(set).to.be.calledWithExactly({ low, high });
    });
  });
});
