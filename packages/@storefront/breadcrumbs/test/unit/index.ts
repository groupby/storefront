import * as pkg from '../../src';
import Breadcrumbs from '../../src/breadcrumbs';
import ClearAllRefinements from '../../src/clear-all-refinements';
import ClearQuery from '../../src/clear-query';
import ClearRefinement from '../../src/clear-refinement';
import RefinementCrumbs from '../../src/refinement-crumbs';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Breadcrumbs', () => {
    expect(pkg.Breadcrumbs).to.eq(Breadcrumbs);
  });

  it('should expose ClearAllRefinements', () => {
    expect(pkg.ClearAllRefinements).to.eq(ClearAllRefinements);
  });

  it('should expose ClearQuery', () => {
    expect(pkg.ClearQuery).to.eq(ClearQuery);
  });

  it('should expose ClearRefinement', () => {
    expect(pkg.ClearRefinement).to.eq(ClearRefinement);
  });

  it('should expose RefinementCrumbs', () => {
    expect(pkg.RefinementCrumbs).to.eq(RefinementCrumbs);
  });
});
