import { Events, ProductTransformer } from '@storefront/core';
import Details from '../../src/details';
import suite from './_suite';

const STRUCTURE = { a: 'b' };

suite('Details', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let details: Details;

  beforeEach(() => (details = new Details()));

  itShouldBeConfigurable(Details);
  itShouldProvideAlias(Details, 'details');

  describe('init()', () => {
    it('should listen for DETAILS_UPDATED and set up initial state', () => {
      const subscribe = (details.subscribe = spy());
      const data = { a: 1 };
      const updateDetails = stub(details, 'updateDetails');
      details.select = spy(() => ({ data }));

      details.init();

      expect(subscribe).to.be.calledWithExactly(Events.DETAILS_UPDATED, updateDetails);
      expect(updateDetails).to.be.calledWithExactly(data);
    });
  });

  describe('updateDetails()', () => {
    it('should update product', () => {
      const product: any = { a: 'b' };
      const transformed = { c: 'd' };
      const set = (details.set = spy());
      const transform = stub(ProductTransformer, 'transform').returns(transformed);
      details.config = { structure: STRUCTURE } as any;

      details.updateDetails(product);

      expect(set).to.be.calledWithExactly({ product: transformed });
      expect(transform).to.be.calledWithExactly(product, STRUCTURE);
    });

    it('should update product to be empty', () => {
      const set = (details.set = spy());
      stub(ProductTransformer, 'transform').callsFake(() => expect.fail());

      details.updateDetails(undefined);

      expect(set).to.be.calledWithExactly({ product: { data: {}, variants: [{}] } });
    });
  });
});
