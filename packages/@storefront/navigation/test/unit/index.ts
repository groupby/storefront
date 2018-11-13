import * as pkg from '../../src';
import Navigation from '../../src/navigation';
import NavigationDisplay from '../../src/navigation-display';
import NavigationHeader from '../../src/navigation-header';
import NavigationList from '../../src/navigation-list';
import Refinement from '../../src/refinement';
import RefinementList from '../../src/refinement-list';
import SliderRefinementControls from '../../src/slider-refinement-controls';
import ValueRefinementControls from '../../src/value-refinement-controls';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Navigation', () => {
    expect(pkg.Navigation).to.eq(Navigation);
  });

  it('should expose NavigationDisplay', () => {
    expect(pkg.NavigationDisplay).to.eq(NavigationDisplay);
  });

  it('should expose NavigationHeader', () => {
    expect(pkg.NavigationHeader).to.eq(NavigationHeader);
  });

  it('should expose NavigationList', () => {
    expect(pkg.NavigationList).to.eq(NavigationList);
  });

  it('should expose RangeRefinementControls', () => {
    expect(pkg.SliderRefinementControls).to.eq(SliderRefinementControls);
  });

  it('should expose Refinement', () => {
    expect(pkg.Refinement).to.eq(Refinement);
  });

  it('should expose RefinementList', () => {
    expect(pkg.RefinementList).to.eq(RefinementList);
  });

  it('should expose ValueRefinementControls', () => {
    expect(pkg.ValueRefinementControls).to.eq(ValueRefinementControls);
  });
});
