import { provide, tag, Events, Tag } from '@storefront/core';
import PreviousSearchTerms from '../../src/previous-search-terms';
import suite from './_suite';

suite('PreviousSearchTerms', ({ expect, spy, itShouldProvideAlias }) => {
  let previousSearchTerms: PreviousSearchTerms;

  beforeEach(() => (previousSearchTerms = new PreviousSearchTerms()));

  itShouldProvideAlias(PreviousSearchTerms, 'previousSearchTerms');

  describe('constructor()', () => {
    describe('props', () => {
      describe('onClick()', () => {
        it('should call actions.search()', () => {
          const query = 'diamond rings';
          const search = spy();
          const handler = previousSearchTerms.props.onClick(query);
          previousSearchTerms.actions = <any>{ search };

          handler();

          expect(search).to.be.calledWith(query);
        })
      })
    })
    describe('state', () => {
      describe('previousSearches', () => {
        it('should set inital value', () => {
          expect(previousSearchTerms.state.previousSearches).to.be.an('array').with.length(0);
        })
      })
    })
  })
  describe('init()', () => {
    it('should listen for flux events', () => {
      const subscribe = (previousSearchTerms.subscribe = spy());
      previousSearchTerms.init();

      expect(subscribe).to.be.calledWith(Events.ORIGINAL_QUERY_UPDATED, previousSearchTerms.updatePreviousSearches)
    })
  })
  describe('updatePreviousSearches', () => {
    beforeEach(() => {
      const subscribe = (previousSearchTerms.subscribe = spy());
      previousSearchTerms.init()
    })
    it('should add search term if not in array and array length less than limit', () => {
      const query = 'diamond rings';
      const handler = previousSearchTerms.updatePreviousSearches;
      handler(query)
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings'])
    })
  })

})
