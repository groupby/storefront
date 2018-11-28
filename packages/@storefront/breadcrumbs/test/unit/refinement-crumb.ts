import RefinementCrumb from '../../src/refinement-crumb';
import suite from './_suite';

suite('RefinementCrumb', ({ expect, spy, itShouldProvideAlias }) => {
  let refinementCrumb: RefinementCrumb;

  beforeEach(() => {
    refinementCrumb = new RefinementCrumb();
  });

  itShouldProvideAlias(RefinementCrumb, 'refinementCrumb');

  describe('init()', () => {
    it('should set up state', () => {
      const label = 'test';
      const props = refinementCrumb.props = <any>{ a: 'b', c: 'd', range: false, value: label };

      refinementCrumb.init();

      expect(refinementCrumb.state).to.eql({ ...props, label });
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState', () => {
      const updateState = refinementCrumb.updateState = spy();

      refinementCrumb.onUpdate();

      expect(updateState).to.be.called;
    });
  });
});
