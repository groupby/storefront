import FilterRefinementControls from '../../src/filter-refinement-controls';
import ValueRefinementControls from '../../src/value-refinement-controls';
import suite from './_suite';

suite('FilterRefinementControls', ({ expect, spy }) => {
  let filterRefinementControls: FilterRefinementControls;

  beforeEach(() => (filterRefinementControls = new FilterRefinementControls()));

  describe('constructor()', () => {
    it('should extend ValueRefinementControls', () => {
      expect(filterRefinementControls).to.be.an.instanceof(ValueRefinementControls);
    });
  });

  describe('get alias()', () => {
    it('should return the alias string', () => {
      expect(filterRefinementControls.alias).to.eq('filterControls');
    });
  });

  describe('fetchMoreRefinements()', () => {
    it('should fetch more refinements if there are more to fetch', () => {
      const moreRefinements = spy();
      filterRefinementControls.state = { more: true, moreRefinements };

      filterRefinementControls.fetchMoreRefinements();

      expect(moreRefinements).to.be.called;
    });
  });
});
