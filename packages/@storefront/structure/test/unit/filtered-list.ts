import FilteredList from '../../src/filtered-list';
import suite from './_suite';

suite('FilteredList', ({ expect, spy, stub }) => {
  let filteredList: FilteredList;

  beforeEach(() => (filteredList = new FilteredList()));

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(filteredList.props).eql(<any>{
          items: [],
          paginate: true,
        });
      });
    });

    describe('state', () => {
      it('should set initial values', () => {
        expect(filteredList.state.items).to.eql([]);
      });
    });
  });

  describe('childProps()', () => {
    it('should return childProps object', () => {
      const itemAlias = 'itemAlias';
      const indexAlias = 'indexAlias';
      const items = (filteredList.state.items = ['a', 'b', 'c', 'd']);
      const paginate = true;
      filteredList.props = {
        ...filteredList.props,
        itemAlias,
        indexAlias,
        paginate,
      };

      filteredList.props = { ...filteredList.props, itemAlias, indexAlias };
      expect(filteredList.childProps()).to.eql({ itemAlias, indexAlias, items });
    });

    it('should set pageSize to the number of items if pagination is disabled', () => {
      const items = filteredList.state.items = ['a', 'b', 'c', 'd', 'e', 'f'];
      filteredList.props = { paginate: false };

      expect(filteredList.childProps().pageSize).to.eq(items.length);
    });
  });

  describe('onBeforeMount()', () => {
    it('should call updateItems()', () => {
      const updateItems = (filteredList.updateItems = spy());
      const items = ['a', 'b'];
      filteredList.props = { items };

      filteredList.onBeforeMount();

      expect(updateItems).to.be.calledWith('');
    });
  });

  describe('onUpdate()', () => {
    it('should call updateItems()', () => {
      const updateItems = (filteredList.updateItems = spy());
      const items = ['a', 'b'];
      filteredList.props = { items };

      filteredList.onUpdate();

      expect(updateItems).to.be.calledWith();
    });
  });

  describe('onFilterChange()', () => {
    it('should call updateItems()', () => {
      const updateItems = (filteredList.updateItems = spy());
      const set = (filteredList.set = spy());

      filteredList.onFilterChange(<any>{});

      expect(updateItems).to.be.calledWith();
      expect(set).to.be.calledWithExactly(true);
    });
  });

  describe('onKeyDown()', () => {
    it('should exit early if the key is not Enter', () => {
      const keyboardEvent: any = { keyCode: 1970 };
      const trim = spy();
      filteredList.refs = <any>{ filter: { value: { trim } } };

      filteredList.onKeyDown(keyboardEvent);

      expect(trim).to.not.be.called;
    });

    it('should select the matched refinement', () => {
      const refinements: any = [{ value: 'a' , onClick: spy() }, { value: 'b', onClick: spy() }];
      const keyboardEvent: any = { keyCode: 13 };
      const input = <any>{ value: 'a' };
      filteredList.props = { items: refinements };
      filteredList.refs = { filter: input };

      filteredList.onKeyDown(keyboardEvent);

      expect(refinements[0].onClick).to.be.called;
      expect(refinements[1].onClick).to.be.not.called;
    });

    it('should select the only refinement', () => {
      const selected = { value: 'foo', onClick: spy() };
      const refinements: any = [selected, { value: 'a', onClick: spy() }, { value: 'b', onClick: spy() }];
      const keyboardEvent: any = { keyCode: 13 };
      const input: any = { value: 'bar' };
      filteredList.props = { items: refinements };
      filteredList.state = { items: [selected] };
      filteredList.refs = { filter: input };

      filteredList.onKeyDown(keyboardEvent);

      expect(selected.onClick).to.be.called;
    });

    it('should do nothing if no refinements are matched', () => {
      const refinements: any = [{ value: 'a' , onClick: spy() }, { value: 'b', onClick: spy() }];
      const keyboardEvent: any = { keyCode: 13 };
      const input = <any>{ value: 'c' };
      filteredList.props = { items: refinements };
      filteredList.refs = { filter: input };

      filteredList.onKeyDown(keyboardEvent);

      expect(refinements[0].onClick).to.be.not.called;
      expect(refinements[1].onClick).to.be.not.called;
    });
  });

  describe('onFilterFocus()', () => {
    it('should call props.onFilterFocus()', () => {
      const onFilterFocus = spy();
      const event: any = { a: 'b' };
      filteredList.props = { onFilterFocus };

      filteredList.onFilterFocus(event);

      expect(onFilterFocus).to.be.calledWith(event);
    });

    it('should do nothing if props.onFilterFocus is not a function', () => {
      const onFilterFocus: any = true;
      const event: any = { a: 'b' };
      filteredList.props = { onFilterFocus };

      expect(() => filteredList.onFilterFocus(event)).to.not.throw;
    });
  });

  describe('filterItem()', () => {
    it('should trim filter value', () => {
      expect(filteredList.filterItem(' \t e \n   ', 'def')).to.be.true;
    });

    it('should filter case-insensitively', () => {
      expect(filteredList.filterItem('EF', 'def')).to.be.true;
    });

    it('should return true if the item matches the filter string', () => {
      expect(filteredList.filterItem('e', 'def')).to.be.true;
    });

    it('should return false if the item does not match the filter string', () => {
      expect(filteredList.filterItem('z', 'def')).to.be.false;
    });

    it('should return true if the item matches the filter object', () => {
      expect(filteredList.filterItem('e', <any>{ value: 'def' })).to.be.true;
    });

    it('should return false if the item does not match the filter object', () => {
      expect(filteredList.filterItem('z', <any>{ value: 'def' })).to.be.false;
    });

    [
      false,
      0,
      '',
      null,
      undefined,
      NaN,
    ].forEach((item) => {
      it(`should return false if the item is: ${item}`, () => {
        expect(filteredList.filterItem('foo', <any>item)).to.be.false;
      });
    });

    it('should return false if the item is invalid', () => {
      expect(filteredList.filterItem('foo', <any>{ value: true })).to.be.false;
    });
  });

  describe('decorateItem()', () => {
    const noop = () => null;
    let item1 = { value: 'foo', onClick: noop };
    let item2 = { value: 'bar', onClick: noop };
    let item3 = { value: 'baz', onClick: noop };

    it('should trim filter value', () => {
      expect(filteredList.decorateItem(' \t foo \n   ', item1, 0, [item1, item2, item3])).to.eql({ ...item1, matchesTerm: true });
    });

    it('should filter case-insensitively', () => {
      expect(filteredList.decorateItem('FOO', item1, 0, [item1, item2, item3])).to.eql({ ...item1, matchesTerm: true });
    });

    it('should decorate if the item matches the filter term', () => {
      expect(filteredList.decorateItem('foo', item1, 0, [item1, item2, item3])).to.eql({ ...item1, matchesTerm: true });
    });

    it('should decorate if the item is the only refinement', () => {
      expect(filteredList.decorateItem('foo', item1, 0, [item1])).to.eql({ ...item1, matchesTerm: true });
    });

    it('should do nothing if the item does not match the filter term', () => {
      expect(filteredList.decorateItem('quux', item1, 0, [item1, item2, item3])).to.eq(item1);
    });

    it('should do nothing if the item is a string', () => {
      const item = 'foo';

      expect(filteredList.decorateItem('foo', item, 0, [item])).to.eq(item);
    });
  });

  describe('updateItems()', () => {
    let decorateItemStub;
    let filterItemStub;

    beforeEach(() => {
      decorateItemStub = stub(filteredList, 'decorateItem').returns((v, item) => item);
      filterItemStub = stub(filteredList, 'filterItem').returns((v, item) => item);
    });

    it('should call filterItem with each item', () => {
      const filterValue = 'e';
      const items = ['abc', 'def', 'ghi', 'eee'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems();

      expect(filterItemStub.args).to.eql([
        [filterValue, items[0]],
        [filterValue, items[1]],
        [filterValue, items[2]],
        [filterValue, items[3]],
      ]);
    });

    it('should call decorateItem', () => {
      const filterValue = 'e';
      const items = ['def', 'eee'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };
      filterItemStub.restore();

      filteredList.updateItems();

      expect(decorateItemStub).to.be.called;
    });

    it('should use value passed in', () => {
      const filterValue = 'a';
      const items = ['abc', 'def', 'ghi', 'eee'];
      filteredList.refs = <any>{ filter: { value: filterValue } };
      filteredList.props = { items };

      filteredList.updateItems('e');

      expect(filterItemStub).to.be.calledWith('e');
    });
  });
});
