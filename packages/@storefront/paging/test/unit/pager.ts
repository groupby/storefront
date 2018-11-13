import Pager from '../../src/pager';
import suite from './_suite';

suite('Pager', ({ expect, spy, stub, itShouldBeConfigurable, itShouldConsumeAlias }) => {
  itShouldConsumeAlias(Pager, 'paging');
});
