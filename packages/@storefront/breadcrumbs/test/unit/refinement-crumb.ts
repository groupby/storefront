import RefinementCrumb from '../../src/refinement-crumb';
import suite from './_suite';

suite('RefinementCrumb', ({ expect, itShouldProvideAlias }) => {
  let refinementCrumb: RefinementCrumb;

  beforeEach(() => {
    refinementCrumb = new RefinementCrumb();
  });

  itShouldProvideAlias(RefinementCrumb, 'refinementCrumb');

});
