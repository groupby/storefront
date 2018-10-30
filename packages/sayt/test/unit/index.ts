import * as pkg from '../../src';
import SaytAutocomplete from '../../src/autocomplete';
import SaytProducts from '../../src/products';
import Sayt from '../../src/sayt';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Sayt', () => {
    expect(pkg.Sayt).to.eq(Sayt);
  });

  it('should expose SaytAutocomplete', () => {
    expect(pkg.SaytAutocomplete).to.eq(SaytAutocomplete);
  });

  it('should expose SaytProducts', () => {
    expect(pkg.SaytProducts).to.eq(SaytProducts);
  });
});
