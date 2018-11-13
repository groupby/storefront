import { Events, Selectors, StoreSections } from '@storefront/core';
import PageSize from '../../src/page-size';
import suite from './_suite';

const PAGE_SIZES = [10, 20, 30];

suite('PageSize', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let pageSize: PageSize;
  let selectPageSizesStub: sinon.SinonStub;
  let selectPastPurchasePageSizesStub: sinon.SinonStub;
  let select: sinon.SinonSpy;

  beforeEach(() => {
    PageSize.prototype.flux = <any>{};
    selectPageSizesStub = stub(PageSize.prototype, 'selectPageSizes');
    select = PageSize.prototype.select = spy(() => PAGE_SIZES);
    pageSize = new PageSize();
  });
  afterEach(() => delete PageSize.prototype.flux);

  itShouldBeConfigurable(PageSize);
  itShouldProvideAlias(PageSize, 'pageSize');

  describe('constructor()', () => {
    describe('state', () => {
      it('should set initial value', () => {
        expect(pageSize.state.pageSizes).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.updatePageSize() when in search section', () => {
          const updatePageSize = spy();
          pageSize.actions = <any>{ updatePageSize };
          pageSize.state.pageSizes = <any[]>[{ value: 20 }, { value: 40 }, { value: 80 }];
          pageSize.props = { storeSection: StoreSections.SEARCH };

          pageSize.state.onSelect(1);

          expect(updatePageSize).to.be.calledWithExactly(40);
        });

        it('should call actions.updatePastPurchasePageSize() when in past purchase section', () => {
          const updatePastPurchasePageSize = spy();
          pageSize.actions = <any>{ updatePastPurchasePageSize };
          pageSize.state.pageSizes = <any[]>[{ value: 20 }, { value: 40 }, { value: 80 }];
          pageSize.props = { storeSection: StoreSections.PAST_PURCHASES };

          pageSize.state.onSelect(1);

          expect(updatePastPurchasePageSize).to.be.calledWithExactly(40);
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for PAGE_SIZE_UPDATED when in search section', () => {
      const subscribe = (pageSize.subscribe = spy());
      const pageSet = (pageSize.set = spy());
      const sizes = [15, 30, 50];
      selectPageSizesStub.returns(sizes);
      pageSize.flux = <any>{ subscribe };
      pageSize.props = { storeSection: StoreSections.SEARCH };

      pageSize.init();

      expect(subscribe).to.be.calledWithExactly(Events.PAGE_SIZE_UPDATED, pageSize.updatePageSizes);
      expect(select).to.be.calledWithExactly(Selectors.pageSizes);
      expect(selectPageSizesStub).to.be.calledWithExactly(PAGE_SIZES);
      expect(pageSet).to.be.calledWithExactly({ pageSizes: sizes });
    });

    it('should listen for PAST_PURCHASE_PAGE_SIZE_UPDATED when in past purchase section', () => {
      const subscribe = (pageSize.subscribe = spy());
      const pageSet = (pageSize.set = spy());
      const sizes = [15, 30, 50];
      selectPageSizesStub.returns(sizes);
      pageSize.props = { storeSection: StoreSections.PAST_PURCHASES };

      pageSize.init();

      expect(subscribe).to.be.calledWithExactly(Events.PAST_PURCHASE_PAGE_SIZE_UPDATED, pageSize.updatePageSizes);
      expect(select).to.be.calledWithExactly(Selectors.pastPurchasePageSizes);
      expect(selectPageSizesStub).to.be.calledWithExactly(PAGE_SIZES);
      expect(pageSet).to.be.calledWithExactly({ pageSizes: sizes });
    });
  });

  describe('updatePageSizes()', () => {
    it('should set pageSizes', () => {
      const state: any = { a: 'b' };
      const selected = ['c', 'd'];
      const selectPageSizes = (pageSize.selectPageSizes = spy(() => selected));
      const set = (pageSize.set = spy());

      pageSize.updatePageSizes(state);

      expect(selectPageSizes).to.be.calledWithExactly(state);
      expect(set).to.be.calledWithExactly({ pageSizes: selected });
    });
  });

  describe('selectPageSizes()', () => {
    beforeEach(() => selectPageSizesStub.restore());

    it('should remap page sizes to options', () => {
      const state: any = {
        items: [12, 14, 16],
        selected: 2,
      };

      const pageSizes = pageSize.selectPageSizes(state);

      expect(pageSizes).to.eql([
        { value: 12, label: 12, selected: false },
        { value: 14, label: 14, selected: false },
        { value: 16, label: 16, selected: true },
      ]);
    });
  });
});
