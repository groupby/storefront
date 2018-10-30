import { Events, ProductTransformer, Selectors } from '@storefront/core';
import Products from '../../src/products';
import suite from './_suite';

const STRUCTURE = { a: 'b' };

suite('Products', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let products: Products;

  beforeEach(() => {
    Products.prototype.config = <any>{ structure: STRUCTURE };
    products = new Products();
  });
  afterEach(() => delete Products.prototype.config);

  itShouldProvideAlias(Products, 'saytProducts');

  describe('constructor()', () => {
    it('should set initial values', () => {
      expect(products.structure).to.eq(STRUCTURE);
    });

    describe('state', () => {
      it('should set initial value', () => {
        expect(products.state).to.eql({ products: [] });
      });
    });
  });

  describe('init()', () => {
    it('should register with autocomplete service', () => {
      const registerProducts = spy();
      products.services = <any>{ autocomplete: { registerProducts } };
      products.subscribe = () => null;
      products.select = stub();
      products.updateProducts = stub();

      products.init();

      expect(registerProducts).to.be.calledWith(products);
    });

    it('should listen for AUTOCOMPLETE_PRODUCTS_UPDATED and set initial state', () => {
      const autocompleteProducts = [{ a: 'b' }, { c: 'd' }];
      const subscribe = (products.subscribe = spy());
      const updateProducts = (products.updateProducts = spy());
      const select = (products.select = stub());
      select.withArgs(Selectors.autocompleteProducts).returns(autocompleteProducts);
      products.services = <any>{ autocomplete: { registerProducts: () => null } };

      products.init();

      expect(subscribe).to.be.calledWith(Events.AUTOCOMPLETE_PRODUCTS_UPDATED, updateProducts);
      expect(updateProducts).to.be.calledWithExactly(autocompleteProducts);
    });
  });

  describe('updateProducts()', () => {
    it('should set products', () => {
      const set = (products.set = spy());
      const transform = spy(() => 'x');
      const transformer = stub(ProductTransformer, 'transformer').returns(transform);

      products.updateProducts(<any[]>['a', 'b', 'c']);

      expect(set).to.be.calledWith({ products: ['x', 'x', 'x'] });
      expect(transform)
        .to.be.calledWith('a')
        .calledWith('b')
        .calledWith('c');
    });
  });
});
