import GenericPaging from '../../src/generic-paging';
import suite from './_suite';

suite('GenericPaging', ({ expect, itShouldProvideAlias }) => {
  let genericPaging: GenericPaging;

  itShouldProvideAlias(GenericPaging, 'paging');
})
