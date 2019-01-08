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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> changed alias name, wrote initial unit test for previous searches component and added file to bootstrap
=======

>>>>>>> added spaces to unit test
    describe('state', () => {
      describe('previousSearches', () => {
        it('should set inital value', () => {
          expect(previousSearchTerms.state.previousSearches).to.be.an('array').with.length(0);
        })
      })
    })
  })
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> changed alias name, wrote initial unit test for previous searches component and added file to bootstrap
=======

>>>>>>> added spaces to unit test
  describe('init()', () => {
    it('should listen for flux events', () => {
      const subscribe = (previousSearchTerms.subscribe = spy());
      previousSearchTerms.init();

      expect(subscribe).to.be.calledWith(Events.ORIGINAL_QUERY_UPDATED, previousSearchTerms.updatePreviousSearches)
    })
  })
<<<<<<< HEAD
<<<<<<< HEAD

  describe('updatePreviousSearches', () => {
    let subscribe, query, handler;

    beforeEach(() => {
      subscribe = (previousSearchTerms.subscribe = spy());
      previousSearchTerms.init()
      query = 'diamond rings';
      handler = previousSearchTerms.updatePreviousSearches;
    })

    it('should add search term if not in array and array length less than limit', () => {
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings'])
    })

    it('should not add the term if it already exist in the array', () => {
      previousSearchTerms.state.previousSearches = ['diamond rings', 'saphire', 'rings', 'diamond', ]
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings', 'saphire', 'rings', 'diamond'])
    })

    it('should remove first term and add new search term if array at limit', () => {
      previousSearchTerms.state.previousSearches = ['saphire', 'rings', 'opals', 'necklaces', 'bracelet', 'earrings'];
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['rings', 'opals', 'necklaces', 'bracelet', 'earrings', 'diamond rings'])
    })

    it('should move search term to beginning of list if in list and searched again', () => {
      previousSearchTerms.state.previousSearches = ['saphire', 'rings', 'opals', 'necklaces', 'diamond rings', 'earrings'];
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings', 'saphire', 'rings', 'opals', 'necklaces', 'earrings'])
    })
  })
=======
=======

>>>>>>> added spaces to unit test
  describe('updatePreviousSearches', () => {
    let subscribe, query, handler;

    beforeEach(() => {
      subscribe = (previousSearchTerms.subscribe = spy());
      previousSearchTerms.init()
      query = 'diamond rings';
      handler = previousSearchTerms.updatePreviousSearches;
    })

    it('should add search term if not in array and array length less than limit', () => {
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings'])
    })

    it('should not add the term if it already exist in the array', () => {
      previousSearchTerms.state.previousSearches = ['diamond rings', 'saphire', 'rings', 'diamond', ]
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings', 'saphire', 'rings', 'diamond'])
    })

    it('should remove first term and add new search term if array at limit', () => {
      previousSearchTerms.state.previousSearches = ['saphire', 'rings', 'opals', 'necklaces', 'bracelet', 'earrings'];
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['rings', 'opals', 'necklaces', 'bracelet', 'earrings', 'diamond rings'])
    })

    it('should move search term to beginning of list if in list and searched again', () => {
      previousSearchTerms.state.previousSearches = ['saphire', 'rings', 'opals', 'necklaces', 'diamond rings', 'earrings'];
      handler(query);
      expect(previousSearchTerms.state.previousSearches).to.eql(['diamond rings', 'saphire', 'rings', 'opals', 'necklaces', 'earrings'])
    })
  })
<<<<<<< HEAD

>>>>>>> changed alias name, wrote initial unit test for previous searches component and added file to bootstrap
=======
>>>>>>> added spaces to unit test
})
