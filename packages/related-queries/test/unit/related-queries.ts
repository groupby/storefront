import { utils, Events, Selectors } from '@storefront/core';
import RelatedQueries from '../../src/related-queries';
import suite from './_suite';

suite('RelatedQueries', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let relatedQueries: RelatedQueries;

  beforeEach(() => (relatedQueries = new RelatedQueries()));

  itShouldBeConfigurable(RelatedQueries);
  itShouldProvideAlias(RelatedQueries, 'relatedQueries');

  describe('constructor()', () => {
    describe('state', () => {
      it('should set initial value', () => {
        expect(relatedQueries.state).to.eql({ relatedQueries: [] });
      });
    });
  });

  describe('init()', () => {
    it('should listen for RELATED_QUERIES_UPDATED and set initial state', () => {
      const subscribe = (relatedQueries.subscribe = spy());
      const queries = [1, 2, 3];
      const select = (relatedQueries.select = stub());
      const updateRelatedQueries = (relatedQueries.updateRelatedQueries = spy());
      select.withArgs(Selectors.relatedQueries).returns(queries);

      relatedQueries.init();

      expect(subscribe).to.be.calledWith(Events.RELATED_QUERIES_UPDATED, relatedQueries.updateRelatedQueries);
      expect(select).to.be.calledWithExactly(Selectors.relatedQueries);
      expect(updateRelatedQueries).to.be.calledWithExactly(queries);
    });
  });

  describe('updateRelatedQueries()', () => {
    it('should set relatedQueries', () => {
      const related: any[] = ['a', 'b'];
      const searchActions = ['c', 'd'];
      const actions = (relatedQueries.actions = <any>{ e: 'f' });
      const set = (relatedQueries.set = spy());
      const mapToSearchActions = stub(utils, 'mapToSearchActions').returns(searchActions);
      relatedQueries.state = <any>{ relatedQueries: [] };

      relatedQueries.updateRelatedQueries(related);

      expect(set).to.be.calledWith({ relatedQueries: searchActions });
      expect(mapToSearchActions).to.be.calledWith(related, actions);
    });

    it('should not set relatedQueries if both empty', () => {
      relatedQueries.set = () => expect.fail();
      relatedQueries.state = <any>{ relatedQueries: [] };

      relatedQueries.updateRelatedQueries([]);
    });
  });
});
