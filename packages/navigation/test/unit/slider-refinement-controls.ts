import RefinementControls from '../../src/refinement-controls';
import SliderRefinementControls from '../../src/slider-refinement-controls';
import suite from './_suite';

suite('SliderRefinementControls', ({ expect, spy }) => {
  let sliderRefinementControls: SliderRefinementControls;

  beforeEach(() => sliderRefinementControls = new SliderRefinementControls());

  describe('onChange()', () => {
    const low = { value: 10 };
    const high = { value: 100 };
    const lower = { a: 'b' };
    const upper = { c: 'd' };
    const propsLow = 12;
    const propsHigh = 50;
    let updateSelected;
    let moveHandle;

    beforeEach(() => {
      updateSelected = sliderRefinementControls.updateSelected = spy();
      moveHandle = spy();
    });

    it('should update selected values and move lower handle', () => {
      const event = <any>{ target: low };
      sliderRefinementControls.tags = <any>{
        'gb-range-selector': {
          refs: {
            low,
            high
          }
        },
        'gb-slider': {
          moveHandle,
          refs: {
            lower,
            upper
          },
          props: {
            low: propsLow,
            high: propsHigh
          }
        }
      };

      sliderRefinementControls.onChange(event);

      expect(updateSelected).to.be.calledWithExactly(low.value, high.value);
      expect(moveHandle).to.be.calledWithExactly(lower, propsLow);
    });

    it('should update selected values and move upper handle', () => {
      const event = <any>{ target: high };
      sliderRefinementControls.tags = <any>{
        'gb-range-selector': {
          refs: {
            low,
            high
          }
        },
        'gb-slider': {
          moveHandle,
          refs: {
            lower,
            upper
          },
          props: {
            low: propsLow,
            high: propsHigh
          }
        }
      };

      sliderRefinementControls.onChange(event);

      expect(updateSelected).to.be.calledWithExactly(low.value, high.value);
      expect(moveHandle).to.be.calledWithExactly(upper, propsHigh);
    });
  });
});
