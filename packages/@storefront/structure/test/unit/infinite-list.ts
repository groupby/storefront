import InfiniteList from '../../src/infinite-list';
import List from '../../src/list';
import suite from './_suite';

suite('InfiniteList', ({ expect, spy, itShouldProvideAlias }) => {
  let infiniteList: InfiniteList;

  beforeEach(() => (infiniteList = new InfiniteList()));

  itShouldProvideAlias(InfiniteList, 'list');
  itShouldProvideAlias(InfiniteList, 'infiniteList');

  describe('inheritance', () => {
    it('should extend List', () => {
      expect(infiniteList).to.be.an.instanceOf(List);
    });
  });

  // this test corresponds to a hotfix to a known riot.js bug; this allows `opts._props` to be parsed as `props`
  // the riot.js bug is detailed here: https://github.com/riot/riot/issues/2655
  // todo: Remove this if a riot.js maintainer resolves the issue, or if StoreFront transtions to the React framework.
  describe('onMount()', () => {
    it('should call this.set() with `true`', () => {
      const set = infiniteList.set = spy();

      infiniteList.onMount();

      expect(set).to.be.calledWith(true);
    });
  });
});
