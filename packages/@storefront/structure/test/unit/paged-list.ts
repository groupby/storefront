import PagedList from '../../src/paged-list';
import suite from './_suite';

suite('PagedList', ({ expect, spy }) => {
  let pagedList: PagedList;

  beforeEach(() => {
    pagedList = new PagedList();
  });

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(pagedList.props).eql(<any>{
          items: [],
          pageSize: 20,
        });
      });
    });

    describe('state', () => {
      it('should set initial values', () => {
        expect(pagedList.state.items).to.eql([]);
        expect(pagedList.state.page).to.eql(1);
      });
    });
  });

  describe('childProps()', () => {
    it('should return childProps object', () => {
      const itemAlias = 'itemAlias';
      const indexAlias = 'indexAlias';
      const items = (pagedList.state.items = <any>[1, 2, 3, 4]);

      pagedList.props = { ...pagedList.props, itemAlias, indexAlias };
      expect(pagedList.childProps()).to.eql({ itemAlias, indexAlias, items });
    });
  });

  describe('init()', () => {
    it('should call updateItems', () => {
      const updateItems = pagedList.updateItems = spy();

      pagedList.init();

      expect(updateItems).to.be.calledWith(pagedList.state.page);
    });
  });

  describe('onUpdate()', () => {
    it('should call updateItems', () => {
      const updateItems = pagedList.updateItems = spy();

      pagedList.onUpdate(<any>{});

      expect(updateItems).to.be.calledWith(pagedList.state.page);
    });

    it('should reset page if props have changed', () => {
      const updateItems = pagedList.updateItems = spy();
      pagedList.props = { items: ['d', 'e', 'f'] };
      pagedList.state = <any>{ page: 3 };

      pagedList.onUpdate(<any>{ items: ['a', 'b', 'c'] });

      expect(pagedList.state.page).to.eq(1);
      expect(updateItems).to.be.calledWith(1);
    });
  });

  describe('updateItems()', () => {
    it('should return new items', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      pagedList.props = { items, pageSize: 2 };
      pagedList.state = <any>{ a: 'b' };

      pagedList.updateItems(2);

      expect(pagedList.state).to.eql({ a: 'b', items: ['c', 'd'] });
    });
  });

  describe('onSwitchPage()', () => {
    it('should set page', () => {
      const page = 2;
      const set = pagedList.set = spy();

      pagedList.onSwitchPage(page);

      expect(set).to.be.calledWith({ page });
    });
  });

  describe('onFirstPage()', () => {
    it('should call onSwitchPage with page 1', () => {
      const onSwitchPage = pagedList.onSwitchPage = spy();

      pagedList.onFirstPage();

      expect(onSwitchPage).to.be.calledWith(1);
    });
  });

  describe('onLastPage()', () => {
    it('should call onSwitchPage with the last page', () => {
      const onSwitchPage = pagedList.onSwitchPage = spy();
      pagedList.props = { pageSize: 2, items: ['a', 'b', 'c', 'd', 'e', 'f'] };

      pagedList.onLastPage();

      expect(onSwitchPage).to.be.calledWith(3);
    });
  });

  describe('onPrevPage()', () => {
    it('should call onSwitchPage with the previous page', () => {
      const onSwitchPage = pagedList.onSwitchPage = spy();
      pagedList.state = <any>{ page: 3 };

      pagedList.onPrevPage();

      expect(onSwitchPage).to.be.calledWith(2);
    });

    it('should not go past the first page', () => {
      const onSwitchPage = pagedList.onSwitchPage = spy();
      pagedList.state = <any>{ page: 1 };

      pagedList.onPrevPage();

      expect(onSwitchPage).to.not.be.called;
    });
  });

  describe('onNextPage()', () => {
    it('should call onSwitchPage with next page', () => {
      const onSwitchPage = pagedList.onSwitchPage = spy();
      pagedList.props = {
        pageSize: 2,
        items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      }
      pagedList.state = <any>{ page: 3 };

      pagedList.onNextPage();

      expect(onSwitchPage).to.be.calledWith(4);
    });

    it('should not go past the last page', () => {
      const onSwitchPage = pagedList.onSwitchPage = spy();
      pagedList.state = <any>{ page: pagedList.lastPage };

      pagedList.onNextPage();

      expect(onSwitchPage).to.not.be.called;
    });
  });
});

