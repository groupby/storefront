import { Selectors } from '@storefront/core';
import Product from '../../src/product';
import suite from './_suite';

suite('Product', ({ expect, spy, itShouldProvideAlias }) => {
  let product: Product;

  beforeEach(() => (product = new Product()));

  itShouldProvideAlias(Product, 'product');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(product.props).to.eql({
          product: {
            data: {},
            variants: [],
          },
        });
      });
    });

    describe('state', () => {
      it('should have initial value', () => {
        expect(product.state.data).to.eql({});
        expect(product.state.variants).to.eql([]);
        expect(product.state.persistent).to.eq(0);
      });

      describe('link()', () => {
        it('should call build with state', () => {
          const build = spy();
          const data = (product.state.data = { id: 3, title: 'grip' });
          product.services = <any>{
            url: {
              beautifier: {
                build,
              },
            },
          };

          product.state.link();

          expect(build).to.be.calledWith('details', { data, variants: [] });
        });
      });

      describe('onClick()', () => {
        it('should call flux.detailsWithRouting with id and title', () => {
          const prod = 'product';
          const detailsWithRouting = spy();
          const data = (product.state.data = { id: '123', title: 'idk' });
          const select = (product.select = spy(() => prod));
          product.flux = <any>{ detailsWithRouting };

          product.state.onClick();

          expect(select).to.be.calledWith(Selectors.findProduct, data.id);
          expect(detailsWithRouting).to.be.calledWith(prod);
        });
      });

      describe('onSelect()', () => {
        it('should revert back to persistent selection', () => {
          const set = (product.set = spy());
          const oldVariant = { a: 'b' };
          product.state.persistent = 1;
          product.props.product = {
            data: {},
            variants: [{ c: 'd' }, oldVariant],
          };

          product.state.onSelect(-1);

          expect(set).to.be.calledWith({ selected: oldVariant });
        });

        it('should set to new selection', () => {
          const set = (product.set = spy());
          const newVariant = { a: 'b' };
          product.props.product = {
            data: {},
            variants: [{ c: 'd' }, newVariant],
          };

          product.state.onSelect(1);

          expect(set).to.be.calledWith({ selected: newVariant });
        });

        it('should set to new selection and set persistent', () => {
          const set = (product.set = spy());
          const newVariant = { a: 'b' };
          const index = 1;
          product.props.product = {
            data: {},
            variants: [{ c: 'd' }, newVariant],
          };

          product.state.onSelect(index, true);

          expect(set).to.be.calledWith({ selected: newVariant, persistent: index });
        });

        it('should not call set()', () => {
          const set = (product.set = spy());
          const newVariant = { a: 'b' };
          const index = 100000;
          product.props.product = {
            data: {},
            variants: [{ c: 'd' }, newVariant],
          };

          product.state.onSelect(index, true);

          expect(set).to.not.be.called;
        });
      });
    });
  });

  describe('init()', () => {
    it('should mixin product to state', () => {
      product.props = <any>{ product: { a: 'b' } };
      product.state = <any>{ c: 'd' };

      product.init();

      expect(product.state).to.eql({ a: 'b', c: 'd' });
    });
  });

  describe('onUpdate()', () => {
    it('should update state', () => {
      const state = <any>{ a: 'b', data: { ayy: 'lmao' } };
      const productStuff = { c: 'd' };
      const newState = { ...state, ...productStuff };
      product.state = state;
      product.props = <any>{
        product: productStuff,
      };
      product.onUpdate();

      expect(product.state).to.eql(newState);
    });

    it('should update data to selected', () => {
      const selected = { ye: 'boy' };
      const state = <any>{ a: 'b', data: { ayy: 'lmao' }, selected };
      const productStuff = { c: 'd' };
      const newState = { ...state, ...productStuff, data: selected };
      product.state = state;
      product.props = <any>{
        product: productStuff,
      };
      product.onUpdate();

      expect(product.state).to.eql(newState);
    });
  });
});
