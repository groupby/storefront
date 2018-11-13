import { Events, Selectors, StoreSections } from '@storefront/core';
import Paging from '../../src/paging';
import suite from './_suite';

suite('Paging', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let paging: Paging;
  let select;
  const page = <any>{
    sizes: {
      items: [10, 20, 30],
      selected: 0,
    },
    current: 5,
    previous: 4,
    next: 6,
    last: 10,
    from: 41,
    to: 50,
  };

  beforeEach(() => {
    paging = new Paging();
    select = paging.select = stub();
    select.withArgs(Selectors.pageObject).returns(page);
  });

  itShouldBeConfigurable(Paging);
  itShouldProvideAlias(Paging, 'paging');

  describe('constructor()', () => {
    describe('props', () => {
      it('should have initial value', () => {
        expect(paging.props).to.eql({
          showIcons: true,
          showLabels: true,
          numericLabels: false,
          labels: { first: 'First', next: 'Next', prev: 'Prev', last: 'Last' },
          limit: 5,
          icons: {},
        });
      });
    });

    describe('state', () => {
      it('should have initial value', () => {
        expect(paging.state.range).to.eql([]);
      });

      describe('when storeSection is invalid', () => {
        let updateCurrentPage;
        let updatePastPurchaseCurrentPage;
        beforeEach(() => {
          updateCurrentPage = spy();
          updatePastPurchaseCurrentPage = spy();
        });

        describe('firstPage()', () => {
          it('should not call any actions', () => {
            paging.state.firstPage();
          });
        });

        describe('lastPage()', () => {
          it('should not call any actions', () => {
            paging.state.lastPage();
          });
        });

        describe('prevPage()', () => {
          it('should not call any actions', () => {
            paging.state.prevPage();
          });
        });

        describe('nextPage()', () => {
          it('should not call any actions', () => {
            paging.state.nextPage();
          });
        });

        describe('updateCurrentPage()', () => {
          it('should not call any actions', () => {
            paging.state.switchPage(1)();
          });
        });

        afterEach(() => {
          expect(updateCurrentPage).to.not.be.called;
          expect(updatePastPurchaseCurrentPage).to.not.be.called;
        });
      });

      describe('when storeSection is search', () => {
        beforeEach(() => {
          paging.state = {
            ...paging.state,
            ...paging.searchActions,
          };
        });

        describe('firstPage()', () => {
          it('should call actions.updateCurrentPage() with state.first', () => {
            const updateCurrentPage = spy();
            const first = (paging.state.first = <any>2);
            paging.actions = <any>{ updateCurrentPage };

            paging.state.firstPage();

            expect(updateCurrentPage).to.be.calledWithExactly(first);
          });
        });

        describe('lastPage()', () => {
          it('should call actions.updateCurrentPage() with state.last', () => {
            const updateCurrentPage = spy();
            const last = (paging.state.last = 4);
            paging.actions = <any>{ updateCurrentPage };

            paging.state.lastPage();

            expect(updateCurrentPage).to.be.calledWithExactly(last);
          });
        });

        describe('prevPage()', () => {
          it('should call actions.updateCurrentPage() with state.previous', () => {
            const updateCurrentPage = spy();
            const previous = (paging.state.previous = 3);
            paging.actions = <any>{ updateCurrentPage };

            paging.state.prevPage();

            expect(updateCurrentPage).to.be.calledWithExactly(previous);
          });
        });

        describe('nextPage()', () => {
          it('should call actions.updateCurrentPage() with state.next', () => {
            const updateCurrentPage = spy();
            const next = (paging.state.next = 10);
            paging.actions = <any>{ updateCurrentPage };

            paging.state.nextPage();

            expect(updateCurrentPage).to.be.calledWithExactly(next);
          });
        });

        describe('updateCurrentPage()', () => {
          it('should return page-switching function', () => {
            const updateCurrentPage = spy();
            const changePage = paging.state.switchPage(4);
            paging.actions = <any>{ updateCurrentPage };

            expect(changePage).to.be.a('function');

            changePage();

            expect(updateCurrentPage).to.be.calledWithExactly(4);
          });
        });
      });

      describe('when storeSection is search', () => {
        beforeEach(() => {
          paging.state = {
            ...paging.state,
            ...paging.pastPurchaseActions,
          };
        });

        describe('firstPage()', () => {
          it('should call actions.updatePastPurchaseCurrentPage() with state.first', () => {
            const updatePastPurchaseCurrentPage = spy();
            const first = (paging.state.first = <any>2);
            paging.actions = <any>{ updatePastPurchaseCurrentPage };

            paging.state.firstPage();

            expect(updatePastPurchaseCurrentPage).to.be.calledWithExactly(first);
          });
        });

        describe('lastPage()', () => {
          it('should call actions.updatePastPurchaseCurrentPage() with state.last', () => {
            const updatePastPurchaseCurrentPage = spy();
            const last = (paging.state.last = 4);
            paging.actions = <any>{ updatePastPurchaseCurrentPage };

            paging.state.lastPage();

            expect(updatePastPurchaseCurrentPage).to.be.calledWithExactly(last);
          });
        });

        describe('prevPage()', () => {
          it('should call actions.updatePastPurchaseCurrentPage() with state.previous', () => {
            const updatePastPurchaseCurrentPage = spy();
            const previous = (paging.state.previous = 3);
            paging.actions = <any>{ updatePastPurchaseCurrentPage };

            paging.state.prevPage();

            expect(updatePastPurchaseCurrentPage).to.be.calledWithExactly(previous);
          });
        });

        describe('nextPage()', () => {
          it('should call actions.updatePastPurchaseCurrentPage() with state.next', () => {
            const updatePastPurchaseCurrentPage = spy();
            const next = (paging.state.next = 10);
            paging.actions = <any>{ updatePastPurchaseCurrentPage };

            paging.state.nextPage();

            expect(updatePastPurchaseCurrentPage).to.be.calledWithExactly(next);
          });
        });

        describe('updatePastPurchaseCurrentPage()', () => {
          it('should return page-switching function', () => {
            const updatePastPurchaseCurrentPage = spy();
            const changePage = paging.state.switchPage(4);
            paging.actions = <any>{ updatePastPurchaseCurrentPage };

            expect(changePage).to.be.a('function');

            changePage();

            expect(updatePastPurchaseCurrentPage).to.be.calledWithExactly(4);
          });
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen on PAGE_UPDATED event and call updatePage() when storeSection is search', () => {
      const subscribe = (paging.subscribe = spy());
      const set = (paging.set = spy());
      const updatePage = (paging.updatePage = spy());
      paging.props = { storeSection: StoreSections.SEARCH };
      select.returns(page);

      paging.init();

      expect(subscribe).to.be.calledWithExactly(Events.PAGE_UPDATED, paging.updatePage);
      expect(select).to.be.calledWithExactly(Selectors.pageObject);
      expect(updatePage).to.be.calledWithExactly(page);
    });

    it('should listen on PAST_PURCHASE_PAGE_UPDATED and call updatePage() when storeSection is pastPurchases', () => {
      const subscribe = (paging.subscribe = spy());
      const set = (paging.set = spy());
      const updatePage = (paging.updatePage = spy());
      paging.props = { storeSection: StoreSections.PAST_PURCHASES };
      select.returns(page);

      paging.init();

      expect(subscribe).to.be.calledWithExactly(Events.PAST_PURCHASE_PAGE_UPDATED, paging.updatePage);
      expect(select).to.be.calledWithExactly(Selectors.pastPurchasePageObject);
      expect(updatePage).to.be.calledWithExactly(page);
    });

    it('should not listen to any events or call set when storeSection is invalid', () => {
      const subscribe = (paging.subscribe = spy());
      const set = (paging.set = spy());
      paging.props = { storeSection: 'giraffe' };

      paging.init();

      expect(subscribe).to.not.be.called;
      expect(set).to.not.be.called;
    });
  });

  describe('updatePage()', () => {
    it('should call set with updated values', () => {
      const set = (paging.set = spy());
      paging.props = <any>{ limit: 5 };

      paging.updatePage(page);

      expect(set).to.be.calledWithExactly({
        ...page,
        backDisabled: false,
        forwardDisabled: false,
        highOverflow: true,
        lowOverflow: true,
        limit: 5,
        range: [3, 4, 5, 6, 7],
      });
    });
  });

  describe('static', () => {
    describe('generateRange()', () => {
      // TODO: move to integration tests
      it('should return correct range when current page is close to firstPage', () => {
        const limit = 3;
        const last = 10;
        const current = 1;

        const updateRange = Paging.generateRange(last, current, limit);

        expect(updateRange).to.eql([1, 2, 3]);
      });

      // TODO: move to integration tests
      it('should return correct range when current page is close to lastPage', () => {
        const limit = 5;
        const last = 10;
        const current = 8;

        const updateRange = Paging.generateRange(last, current, limit);

        expect(updateRange).to.eql([6, 7, 8, 9, 10]);
      });

      // TODO: move to integration tests
      it('should return correct range when current page is in the middle', () => {
        const limit = 5;
        const last = 10;
        const current = 6;

        const updateRange = Paging.generateRange(last, current, limit);

        expect(updateRange).to.eql([4, 5, 6, 7, 8]);
      });

      it('should call range() when current page is close to firstPage', () => {
        const limit = 3;
        const last = 10;
        const current = 1;
        const range = stub(Paging, 'range');

        Paging.generateRange(last, current, limit);

        expect(range).to.be.calledWithExactly(1, limit);
      });

      it('should call range() when current page is close to lastPage', () => {
        const last = 10;
        const current = 8;
        const range = stub(Paging, 'range');

        Paging.generateRange(last, current, 5);

        expect(range).to.be.calledWithExactly(6, 10);
      });

      it('should call range() when current page is in the middle', () => {
        const limit = 5;
        const last = 10;
        const current = 6;
        const range = stub(Paging, 'range');
        paging.props = <any>{ limit };

        const updateRange = Paging.generateRange(last, current, limit);

        expect(range).to.be.calledWithExactly(4, 8);
      });
    });

    describe('range()', () => {
      it('should return an array of numbers from low to high', () => {
        expect(Paging.range(3, 10)).to.eql([3, 4, 5, 6, 7, 8, 9, 10]);
        expect(Paging.range(2, 5)).to.eql([2, 3, 4, 5]);
        expect(Paging.range(0, 1)).to.eql([0, 1]);
      });
    });
  });
});
