import * as pkg from '../../src';
import Products from '../../src/products';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Products', () => {
    expect(pkg.Products).to.eq(Products);
  });
});
