import RefinementCrumb from '../../src/refinement-crumb';
import suite from './_suite';

suite('RefinementCrumb', ({ expect, itShouldProvideAlias }) => {
  let refinementCrumb: RefinementCrumb;

  beforeEach(() => {
    refinementCrumb = new RefinementCrumb();
  });

  itShouldProvideAlias(RefinementCrumb, 'refinementCrumb');

  describe('init()', () => {
    it('should spread props into state', () => {
      const props = refinementCrumb.props = <any>{ a: 'b', c: 'd' };

      refinementCrumb.init();

      expect(refinementCrumb.state).to.eql(props);
      expect(refinementCrumb.state).to.not.eq(props);
    });
  });
});
