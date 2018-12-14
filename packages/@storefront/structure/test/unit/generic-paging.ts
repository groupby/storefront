import GenericPaging from '../../src/generic-paging';
import suite from './_suite';

suite('GenericPaging', ({ expect, spy, itShouldProvideAlias }) => {
  let genericPaging: GenericPaging;

  beforeEach(() => {
    genericPaging = new GenericPaging();
  });

  itShouldProvideAlias(GenericPaging, 'paging');

  describe('constructor()', () => {
    describe('props', () => {
      it('should have initial value', () => {
        expect(genericPaging.props).to.eql({
          showIcons: true,
          showLabels: true,
          numericLabels: false,
          labels: { first: 'First', next: 'Next', prev: 'Prev', last: 'Last' },
          limit: 5,
          icons: {},
        });
      });
    });
  });

  function testHandler(handlerName: string) {
    describe(handlerName + '()', () => {
      it('should not throw when no props are passed in',  () => {
        expect(() => genericPaging[handlerName]()).to.not.throw();
      });
    });
  }

  testHandler('firstPage');
  testHandler('lastPage');
  testHandler('prevPage');
  testHandler('nextPage');
});
