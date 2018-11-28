import RefinementCrumb from '../../src/refinement-crumb';
import suite from './_suite';

suite('RefinementCrumb', ({ expect, spy, itShouldProvideAlias }) => {
  let refinementCrumb: RefinementCrumb;

  beforeEach(() => {
    refinementCrumb = new RefinementCrumb();
  });

  itShouldProvideAlias(RefinementCrumb, 'refinementCrumb');

  describe('init()', () => {
    it('should call updateState', () => {
      const updateState = refinementCrumb.updateState = spy();

      refinementCrumb.init();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState', () => {
      const updateState = refinementCrumb.updateState = spy();

      refinementCrumb.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    it('should set state', () => {
      const label = 'test';
      const props = refinementCrumb.props = <any>{ a: 'b', c: 'd', range: false, value: label };

      refinementCrumb.updateState();

      expect(refinementCrumb.state).to.eql({ ...props, label });
    });

    it('should set label to a range', () => {
      const low = 1;
      const high = 10;
      const props = refinementCrumb.props = <any>{
        a: 'b',
        range: true,
        value: 'test',
        low,
        high,
      };

      refinementCrumb.updateState();

      expect(refinementCrumb.state.label).to.eq(`${low} - ${high}`);
    });

    it('should set label to value when range is false', () => {
      const value = 'test';
      const props = refinementCrumb.props = <any>{
        a: 'b',
        range: false,
        value,
        low: 1,
        high: 10,
      };

      refinementCrumb.updateState();

      expect(refinementCrumb.state.label).to.eq(value);
    });
  });
});
