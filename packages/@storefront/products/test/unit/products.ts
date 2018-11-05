import { Events, ProductTransformer, Selectors, StoreSections } from '@storefront/core';
import Products from '../../src/products';
import suite from './_suite';

const STRUCTURE = { a: 'b' };

suite('Products', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let products: Products;

  beforeEach(() => {
    Products.prototype.config = <any>{ structure: STRUCTURE };
    products = new Products();
  });
  afterEach(() => delete Products.prototype.config);

  itShouldBeConfigurable(Products);
  itShouldProvideAlias(Products, 'products');

  describe('constructor()', () => {
    describe('state', () => {
      it('should have initial value', () => {
        expect(products.state).to.eql({ products: [] });
      });
    });

    describe('productTransformer()', () => {
      it('should wrap ProductTransformer', () => {
        const data: any = { a: 'b' };
        const meta: any = { c: 'd' };
        const transformed = { y: 'z' };
        const structure = { e: 'f' };
        const transformer = spy(() => ({ data: transformed }));
        const transformerFactory = stub(ProductTransformer, 'transformer').returns(transformer);
        products.config = { structure } as any;

        expect(products.productTransformer({ data, index: 1, meta })).to.eql({ data: transformed, meta });
        expect(transformerFactory).to.be.calledWithExactly(structure);
        expect(transformer).to.be.calledWithExactly(data);
      });
    });
  });

  describe('init()', () => {
    it('should listen for PRODUCTS_UPDATED', () => {
      const subscribe = (products.subscribe = spy());
      products.updateProducts = () => null;
      products.props = {};
      products.props = { storeSection: StoreSections.SEARCH };

      products.init();

      expect(subscribe).to.be.calledWith(Events.PRODUCTS_UPDATED, products.updateProducts);
    });

    it('should listen for PAST_PURCHASE_PRODUCTS_UPDATED', () => {
      const subscribe = (products.subscribe = spy());
      products.props = { storeSection: StoreSections.PAST_PURCHASES };
      products.select = () => null;
      products.updatePastPurchaseProducts = () => null;

      products.init();

      expect(subscribe).to.be.calledWith(Events.PAST_PURCHASE_PRODUCTS_UPDATED, products.updatePastPurchaseProducts);
    });

    it('should mixin props to state', () => {
      const state = <any>{ a: 'b' };
      products.updateProducts = () => null;
      products.subscribe = () => null;
      products.state = state;
      products.props = {};
      products.props.storeSection = StoreSections.DEFAULT;

      products.init();

      expect(products.state).to.eql(state);
    });

    it('should call updateProducts', () => {
      const state = <any>{ a: 'b' };
      const updateProducts = (products.updateProducts = spy());
      products.props = { storeSection: StoreSections.SEARCH };
      products.subscribe = () => null;
      products.state = state;

      products.init();

      expect(updateProducts).to.be.calledOnce;
    });
  });

  describe('updateProducts()', () => {
    it('should set products', () => {
      const idField = 'sku';
      const set = (products.set = spy());
      const select = (products.select = spy(() => ['a', 'b', 'c']));
      const transform = (products.productTransformer = spy(() => 'x'));
      products.config = <any>{ recommendations: { idField } };
      products.props = {};

      products.updateProducts();

      expect(set).to.be.calledWith({ products: ['x', 'x', 'x'] });
      expect(select).to.be.calledWithExactly(Selectors.productsWithPastPurchase, idField);
      expect(transform)
        .to.have.callCount(3)
        .and.calledWith('a')
        .and.calledWith('b')
        .and.calledWith('c');
    });
  });
  describe('updatePastPurchaseProducts()', () => {
    it('should set past purchase products', () => {
      const set = (products.set = spy());
      const productsArray = [{ meta: 'a', a: 1 }, { meta: 'b', a: 2 }, { meta: 'c', a: 3 }];
      const mappedArray = [{ meta: 'a', data: { a: 1 } }, { meta: 'b', data: { a: 2 } }, { meta: 'c', data: { a: 3 } }];
      const productTransformer = (products.productTransformer = stub().returnsArg(0));

      products.updatePastPurchaseProducts(productsArray);

      expect(set).to.be.calledWith({ products: mappedArray });
      expect(productTransformer.callCount).to.eql(productsArray.length);
      for (const element of mappedArray) {
        expect(productTransformer).to.be.calledWith(element);
      }
    });

    it('should call map with productTransformer', () => {
      const map = stub();
      const productsArray: any = { map };
      map.returns(productsArray);
      products.set = spy();

      products.updatePastPurchaseProducts(productsArray);

      expect(map).to.be.calledWithExactly(products.productTransformer);
    });

    it('should default to empty array', () => {
      const set = (products.set = spy());
      const productTransformer = (products.productTransformer = stub().returnsArg(0));

      products.updatePastPurchaseProducts();

      expect(set).to.be.calledWith({ products: [] });
      expect(productTransformer).to.not.be.called;
    });
  });
});
