import FilteredRefinementList from '../../src/filtered-refinement-list';
import RefinementList from '../../src/refinement-list';
import suite from './_suite';

suite('FilteredRefinementList', ({ expect, itShouldConsumeAlias }) => {
  let filteredRefinementList: FilteredRefinementList;

  beforeEach(() => (filteredRefinementList = new FilteredRefinementList()));

  itShouldConsumeAlias(FilteredRefinementList, 'filterControls');

  describe('constructor()', () => {
    it('should extend RefinementList', () => {
      expect(filteredRefinementList).to.be.an.instanceof(RefinementList);
    });
  });

  describe('get alias()', () => {
    it('should return alias name', () => {
      expect(filteredRefinementList.alias).to.eq('filteredRefinements');
    });
  });
});
