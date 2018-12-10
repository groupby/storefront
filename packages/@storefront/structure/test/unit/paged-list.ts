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
});

