import GenericPaging from '../../src/generic-paging';
import suite from './_suite';

suite('GenericPaging', ({ expect, spy, stub, itShouldProvideAlias }) => {
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

  describe('static', () => {
    describe('generateRange()', () => {
      it('should return correct range when current page is close to firstPage', () => {
        const limit = 3;
        const last = 10;
        const current = 1;

        const updateRange = GenericPaging.generateRange(last, current, limit);

        expect(updateRange).to.eql([1, 2, 3]);
      });

      it('should return correct range when current page is close to lastPage', () => {
        const limit = 5;
        const last = 10;
        const current = 8;

        const updateRange = GenericPaging.generateRange(last, current, limit);

        expect(updateRange).to.eql([6, 7, 8, 9, 10]);
      });

      it('should return correct range when current page is in the middle', () => {
        const limit = 5;
        const last = 10;
        const current = 6;

        const updateRange = GenericPaging.generateRange(last, current, limit);

        expect(updateRange).to.eql([4, 5, 6, 7, 8]);
      });

      it('should call range() when current page is close to firstPage', () => {
        const limit = 3;
        const last = 10;
        const current = 1;
        const range = stub(GenericPaging, 'range');

        GenericPaging.generateRange(last, current, limit);

        expect(range).to.be.calledWithExactly(1, limit);
      });

      it('should call range() when current page is close to lastPage', () => {
        const last = 10;
        const current = 8;
        const range = stub(GenericPaging, 'range');

        GenericPaging.generateRange(last, current, 5);

        expect(range).to.be.calledWithExactly(6, 10);
      });

      it('should call range() when current page is in the middle', () => {
        const limit = 5;
        const last = 10;
        const current = 6;
        const range = stub(GenericPaging, 'range');
        genericPaging.props = <any>{ limit };

        const updateRange = GenericPaging.generateRange(last, current, limit);

        expect(range).to.be.calledWithExactly(4, 8);
      });
    });

    describe('range()', () => {
      it('should return an array of numbers from low to high', () => {
        expect(GenericPaging.range(3, 10)).to.eql([3, 4, 5, 6, 7, 8, 9, 10]);
        expect(GenericPaging.range(2, 5)).to.eql([2, 3, 4, 5]);
        expect(GenericPaging.range(0, 1)).to.eql([0, 1]);
      });
    });
  });
});
