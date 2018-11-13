import { ProductTransformer } from '@storefront/core';
import ProductsZone from '../../src/products-zone';
import suite from './_suite';

const STRUCTURE = { a: 'b' };

suite('ProductsZone', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let productsZone: ProductsZone;

  beforeEach(() => {
    ProductsZone.prototype.config = <any>{ structure: STRUCTURE };
    productsZone = new ProductsZone();
  });
  afterEach(() => delete ProductsZone.prototype.config);

  itShouldProvideAlias(ProductsZone, 'zone');

  describe('onBeforeMount()', () => {
    it('should call updateState()', () => {
      const updateState = (productsZone.updateState = spy());

      productsZone.onBeforeMount();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateState()', () => {
      const updateState = (productsZone.updateState = spy());

      productsZone.onBeforeMount();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should update state', () => {
      const zone: any = { a: 'b', products: ['c', 'd', 'e'] };
      const transform = spy(() => 'x');
      const transformer = stub(ProductTransformer, 'transformer').returns(transform);
      productsZone.props = { zone };

      productsZone.onUpdate();

      expect(productsZone.state).to.eql({ a: 'b', products: ['x', 'x', 'x'] });
      expect(transform)
        .to.be.calledWith('c')
        .calledWith('d')
        .calledWith('e');
    });
  });
});
