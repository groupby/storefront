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

      it('should wrap the function passed in as props', () => {
        const handler = spy();
        genericPaging.props = { [handlerName]: handler };

        genericPaging[handlerName]();

        expect(handler).to.be.called;
      });
    });
  }

  testHandler('firstPage');
  testHandler('lastPage');
  testHandler('prevPage');
  testHandler('nextPage');

  describe('switchPage()', () => {
    it('should not throw when no props are passed in',  () => {
      expect(() => genericPaging.switchPage(5)).to.not.throw();
    });

    it('should wrap the function passed in as props', () => {
      const switchPage = spy();
      const page = 5;
      genericPaging.props = { switchPage };

      genericPaging.switchPage(page);

      expect(switchPage).to.be.calledWith(page);
    });
  });
});
