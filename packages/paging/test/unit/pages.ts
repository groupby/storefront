import Pages from '../../src/pages';
import suite from './_suite';

suite('Pages', ({ expect, spy, stub, itShouldBeConfigurable, itShouldConsumeAlias }) => {
  itShouldConsumeAlias(Pages, 'paging');
});
