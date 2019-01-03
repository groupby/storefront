import Pages from '../../src/pages';
import suite from './_suite';

suite('Pages', ({ itShouldConsumeAlias }) => {
  itShouldConsumeAlias(Pages, 'paging');
});
