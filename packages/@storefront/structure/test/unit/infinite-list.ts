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

  describe('onMount()', () => {
  // tslint:disable comment-format
  // XXX: This test corresponds to a hotfix to a known riot.js bug; this allows `opts._props` to be parsed as `props`.
  // Source: https://github.com/riot/riot/issues/2655
  // TODO: Remove this if a riot.js maintainer resolves the issue, or if StoreFront transtions to the React framework.
    it('should call this.set() with `true`', () => {
      const set = infiniteList.set = spy();

      infiniteList.onMount();

      expect(set).to.be.calledWith(true);
    });
  });
});
