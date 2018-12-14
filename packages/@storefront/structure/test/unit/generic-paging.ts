import GenericPaging from '../../src/generic-paging';
import suite from './_suite';

suite('GenericPaging', ({ expect, itShouldProvideAlias }) => {
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

    describe('firstPage()', () => {
      it('should not throw when no props are passed in', () => {
        expect(() => genericPaging.firstPage()).to.not.throw();
      })
    });

    describe('lastPage()', () => {
      it('should not throw when no props are passed in', () => {
        expect(() => genericPaging.lastPage()).to.not.throw();
      })
    });

    describe('nextPage()', () => {
      it('should not throw when no props are passed in', () => {
        expect(() => genericPaging.nextPage()).to.not.throw();
      })
    });
  });
});
