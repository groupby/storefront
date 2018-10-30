import { Events, Selectors } from '@storefront/core';
import * as sinon from 'sinon';
import PastPurchase from '../../src/past-purchase';
import suite from './_suite';

const PAST = ['a', 'b'];

suite('PastPurchase', ({ expect, spy, stub, itShouldProvideAlias }) => {
  let pastPurchase: PastPurchase;
  let queryPastPurchases: sinon.SinonStub;

  beforeEach(() => {
    PastPurchase.prototype.select = <any>spy(() => PAST);
    pastPurchase = new PastPurchase();
  });

  itShouldProvideAlias(PastPurchase, 'pastPurchaseItem');

  describe('state', () => {
    it('should hold pastPurchases', () => {
      expect(pastPurchase.state).to.eql({
        onClick: pastPurchase.state.onClick,
        pastPurchases: PAST.length,
      });
      expect(pastPurchase.select).to.be.calledWith(Selectors.saytPastPurchases);
    });

    describe('onClick()', () => {
      it('should dispatch update query', () => {
        const data = 'past';
        const action = { a: 'b' };
        const emit = spy();
        const dispatch = (pastPurchase.dispatch = spy());
        const updatePastPurchaseQuery = spy(() => action);
        pastPurchase.flux = <any>{
          actions: {
            updatePastPurchaseQuery,
          },
          emit,
        };
        pastPurchase.props = { data };

        pastPurchase.state.onClick();

        expect(updatePastPurchaseQuery).to.be.calledWithExactly(data);
        expect(dispatch).to.be.calledWithExactly(action);
        expect(emit).to.be.calledWith('sayt:hide');
      });
    });
  });

  describe('init()', () => {
    it('should wait on SAYT_PAST_PURCHASE_UPDATED', () => {
      const subscribe = (pastPurchase.subscribe = spy());

      pastPurchase.init();

      expect(subscribe).to.be.calledWithExactly(Events.SAYT_PAST_PURCHASES_UPDATED, pastPurchase.updatePastPurchases);
    });
  });

  describe('updatePastPurchases()', () => {
    it('should call set with past purchase length', () => {
      const doSet = (pastPurchase.set = spy());
      const purchases: any[] = [1, 2, 3, 4, 55, 5, 54];

      pastPurchase.updatePastPurchases(purchases);

      expect(doSet).to.be.calledWith({ pastPurchases: purchases.length });
    });
  });
});
