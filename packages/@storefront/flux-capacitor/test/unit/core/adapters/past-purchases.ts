import ConfigurationAdapter from '../../../../src/core/adapters/configuration';
import PastPurchaseAdapter from '../../../../src/core/adapters/past-purchases';
import Selectors from '../../../../src/core/selectors';
import suite from '../../_suite';

suite('PastPurchase Adapter', ({ expect, stub }) => {
  describe('buildUrl()', () => {
    it('should build a correct past purchase url', () => {
      const customerId = 'storefront';
      const endpoint = 'pastPurchases';

      expect(PastPurchaseAdapter.buildUrl(customerId, endpoint))
        .to.eq(`https://${customerId}.groupbycloud.com/orders/v1/public/skus/${endpoint}`);
    });
  });

  describe('pastPurchaseBiasing()', () => {
    const idField = 'productId';
    const biasInfluence = 8;
    const biasStrength = 2;
    const state: any = {
      data: {
        present: {
          pastPurchases: {
            skus: [{ sku: 'a' }, { sku: 'b' }, { sku: 'c' }]
          }
        }
      }
    };

    it('should generate biases from past purchase product SKUs', () => {
      const config: any = {
        recommendations: {
          idField,
          pastPurchases: { biasStrength, biasInfluence, biasCount: 10 }
        }
      };
      stub(Selectors, 'config').returns(config);

      const biasing = PastPurchaseAdapter.pastPurchaseBiasing(state);

      expect(biasing).to.eql({
        bringToTop: [],
        augmentBiases: true,
        influence: biasInfluence,
        biases: [
          { name: idField, content: 'a', strength: biasStrength },
          { name: idField, content: 'b', strength: biasStrength },
          { name: idField, content: 'c', strength: biasStrength },
        ]
      });
    });

    it('should limit generated biases by biasCount', () => {
      const config: any = {
        recommendations: {
          idField,
          pastPurchases: { biasStrength, biasInfluence, biasCount: 2 }
        }
      };
      stub(Selectors, 'config').returns(config);

      const biasing = PastPurchaseAdapter.pastPurchaseBiasing(state);

      expect(biasing.biases).to.eql([
        { name: idField, content: 'a', strength: biasStrength },
        { name: idField, content: 'b', strength: biasStrength }
      ]);
    });
  });

  describe('pastPurchaseProducts', () => {
    it('should create an object mapping product.id to each product', () => {
      const product1 = { data: { id: '1' } };
      const product2 = { data: { id: '2' } };
      const product3 = { data: { id: '3' } };
      const products: any = [product1, product2, product3];

      expect(PastPurchaseAdapter.pastPurchaseProducts(products)).to.eql({
        1: product1,
        2: product2,
        3: product3,
      });
    });
  });

  describe('sku sorts', () => {
    const product1 = { quantity: 1, lastPurchased: 20 };
    const product2 = { quantity: 3, lastPurchased: 10 };
    const product3 = { quantity: 2, lastPurchased: 30 };
    const oldArr: any = [product1, product2, product3];

    describe('sortSkus', () => {
      it('should sort by the given field - quantity', () => {
        const newArr = [product2, product3, product1];

        expect(PastPurchaseAdapter.sortSkus(oldArr, 'quantity')).to.eql(newArr);
      });

      it('should sort by the given field - lastPurchased', () => {
        expect(PastPurchaseAdapter.sortSkus(oldArr, 'lastPurchased')).to.eql([product3, product1, product2]);
      });
    });
  });
});
