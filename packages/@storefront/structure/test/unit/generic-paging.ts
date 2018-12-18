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
          icons: {},
          pageSize: 20,
          current: 1,
          itemCount: 0,
          limit: 5,
        });
      });
    });

    describe('state', () => {
      it('should have initial values', () => {
        expect(genericPaging.state).to.deep.include({
          range: [],
          lowOverflow: false,
          highOverflow: false
        });
      });

      function testHandler(handlerName: string, propName: string) {
        describe(handlerName + '()', () => {
          it('should not throw when no props are passed in', () => {
            expect(() => genericPaging.state[handlerName]()).to.not.throw();
          });

          it('should wrap the function passed in as props', () => {
            const handler = spy();
            genericPaging.props = { [propName]: handler };

            genericPaging.state[handlerName]();

            expect(handler).to.be.called;
          });
        });
      }

      testHandler('firstPage', 'onFirstPage');
      testHandler('lastPage', 'onLastPage');
      testHandler('prevPage', 'onPrevPage');
      testHandler('nextPage', 'onNextPage');

      describe('switchPage()', () => {
        it('should not throw when no props are passed in', () => {
          expect(() => genericPaging.state.switchPage(5)()).to.not.throw();
        });

        it('should wrap the function passed in as props', () => {
          const onSwitchPage = spy();
          const page = 5;
          genericPaging.props = { onSwitchPage };

          genericPaging.state.switchPage(page)();

          expect(onSwitchPage).to.be.calledWith(page);
        });
      });
    });
  });

  describe('init()', () => {
    it('should call updateState()', () => {
      const updateState = genericPaging.updateState = spy();

      genericPaging.init();

      expect(updateState).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should call updateRange()', () => {
      const updateState = genericPaging.updateState = spy();

      genericPaging.onUpdate();

      expect(updateState).to.be.called;
    });
  });

  describe('updateState()', () => {
    it('should spread props into state', () => {
      const state = genericPaging.state = <any>{ a: 'b', c: 'd' };
      const props = genericPaging.props = <any>{ c: 'z', e: 'f', g: 'h' };
      genericPaging.updateRange = () => null;

      genericPaging.updateState();

      expect(genericPaging.state).to.eql({ ...state, ...props });
    });

    it('should call updateRange()', () => {
      const itemCount = 20;
      const pageSize = 2;
      const current = 5;
      const limit = 5;
      const updateRange = genericPaging.updateRange = spy();
      genericPaging.props = { itemCount, pageSize, current, limit };

      genericPaging.updateState();

      expect(updateRange).to.be.calledWith(itemCount, pageSize, current, limit);
    });
  });

  describe('updateRange()', () => {
    it('should set the range in state', () => {
      const itemCount = 20;
      const pageSize = 2;
      const current = 5;
      const limit = 5;

      genericPaging.updateRange(itemCount, pageSize, current, limit);

      expect(genericPaging.state.range).to.eql([3, 4, 5, 6, 7]);
    });

    it('should set overflow values in state', () => {
      const itemCount = 20;
      const pageSize = 2;
      const current = 5;
      const limit = 5;

      genericPaging.updateRange(itemCount, pageSize, current, limit);

      expect(genericPaging.state.lowOverflow).to.be.true;
      expect(genericPaging.state.highOverflow).to.be.true;
    });

    it('should set lowOverflow to false in state for the lowest range', () => {
      const itemCount = 20;
      const pageSize = 2;
      const current = 2;
      const limit = 5;

      genericPaging.updateRange(itemCount, pageSize, current, limit);

      expect(genericPaging.state.lowOverflow).to.be.false;
      expect(genericPaging.state.highOverflow).to.be.true;
    });

    it('should set highOverflow to false in state for the highest range', () => {
      const itemCount = 20;
      const pageSize = 2;
      const current = 19;
      const limit = 5;

      genericPaging.updateRange(itemCount, pageSize, current, limit);

      expect(genericPaging.state.lowOverflow).to.be.true;
      expect(genericPaging.state.highOverflow).to.be.false;
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
