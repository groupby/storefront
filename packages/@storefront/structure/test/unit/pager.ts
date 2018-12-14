import Pager from '../../src/pager';
import suite from './_suite';

suite('Pager', ({ itShouldConsumeAlias }) => {
  itShouldConsumeAlias(Pager, 'paging');
});
