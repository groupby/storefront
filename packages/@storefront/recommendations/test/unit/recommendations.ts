import { Events, ProductTransformer, Selectors } from '@storefront/core';
import * as sinon from 'sinon';
import Recommendations from '../../src/recommendations';
import suite from './_suite';

const STRUCTURE = { w: 'x' };
const RECOMMENDATIONS_PRODUCTS = [{ value: '1' }, { value: '2' }, { value: '3' }];

suite('Recommendations', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let select: sinon.SinonStub;
  let recommendations: Recommendations;

  beforeEach(() => {
    Recommendations.prototype.config = <any>{ structure: STRUCTURE };
    Recommendations.prototype.flux = <any>{};
    select = Recommendations.prototype.select = stub().returns(RECOMMENDATIONS_PRODUCTS);
    recommendations = new Recommendations();
  });
  afterEach(() => {
    delete Recommendations.prototype.flux;
    delete Recommendations.prototype.config;
  });

  itShouldProvideAlias(Recommendations, 'recommendations');

  describe('constructor()', () => {
    describe('state', () => {
      it('should set initial value', () => {
        const products = ['a', 'b', 'c'];
        const remapped = ['d', 'e', 'f'];
        const mapProducts = stub(Recommendations.prototype, 'mapProducts').returns(remapped);
        select.returns(products);

        const tag = new Recommendations();

        expect(tag.state).to.eql({ products: remapped });
        expect(mapProducts).to.be.calledWith(products);
      });
    });
  });

  describe('init()', () => {
    it('should listen for RECOMMENDATIONS_PRODUCTS_UPDATED and set up initial state', () => {
      const subscribe = (recommendations.subscribe = spy());
      const updateProducts = (recommendations.updateProducts = spy());

      recommendations.init();

      expect(subscribe).to.be.calledWithExactly(Events.RECOMMENDATIONS_PRODUCTS_UPDATED, updateProducts);
      expect(updateProducts).to.be.calledWithExactly(RECOMMENDATIONS_PRODUCTS);
    });
  });

  describe('updateProducts()', () => {
    it('should set products', () => {
      const products: any[] = ['a', 'b', 'c'];
      const remapped = ['d', 'e', 'f'];
      const set = (recommendations.set = spy());
      const mapProducts = (recommendations.mapProducts = spy(() => remapped));

      recommendations.updateProducts(products);

      expect(set).to.be.calledWithExactly({ products: remapped });
      expect(mapProducts).to.be.calledWithExactly(products);
    });
  });

  describe('mapProducts()', () => {
    it('should transform and remap products', () => {
      const transform = spy(() => 'x');
      const transformer = stub(ProductTransformer, 'transformer').returns(transform);
      recommendations.config = { structure: STRUCTURE } as any;

      expect(recommendations.mapProducts(<any[]>['a', 'b', 'c'])).to.eql(['x', 'x', 'x']);
      expect(transformer).to.be.calledWithExactly(STRUCTURE);
      expect(transform)
        .to.be.calledThrice.and.calledWith('a')
        .and.calledWith('b')
        .and.calledWith('c');
    });
  });
});
