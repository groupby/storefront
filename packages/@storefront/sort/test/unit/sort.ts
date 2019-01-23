import { Events, Selectors, StoreSections } from '@storefront/core';
import Sort from '../../src/sort';
import suite from './_suite';

suite('Sort', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let sort: Sort;

  beforeEach(() => (sort = new Sort()));

  itShouldBeConfigurable(Sort);
  itShouldProvideAlias(Sort, 'sort');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(sort.props).to.eql({ labels: [], pastPurchasesLabels: [] });
      });
    });

    describe('state', () => {
      it('should set initial value', () => {
        expect(sort.state.sorts).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.selectSort() when storeSection is search', () => {
          const selectSort = spy();
          sort.props.storeSection = StoreSections.SEARCH;
          sort.actions = <any>{ selectSort };

          sort.state.onSelect(9);

          expect(selectSort).to.be.calledWith(9);
        });

        it('should call actions.selectPastPurchasesSort() when storeSection is pastPurchases', () => {
          const selectPastPurchasesSort = spy();
          sort.props.storeSection = StoreSections.PAST_PURCHASES;
          sort.actions = <any>{ selectPastPurchasesSort };

          sort.state.onSelect(9);

          expect(selectPastPurchasesSort).to.be.calledWith(9);
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for SORTS_UPDATED when storeSection is search', () => {
      const subscribe = (sort.subscribe = spy());
      sort.props.storeSection = StoreSections.SEARCH;
      sort.updateSorts = () => null;

      sort.init();

      expect(subscribe).to.be.calledWith(Events.SORTS_UPDATED, sort.updateSorts);
    });

    it('should listen for PAST_PURCHASE_SORT_UPDATED when storeSection is pastPurchases', () => {
      const subscribe = (sort.subscribe = spy());
      sort.props.storeSection = StoreSections.PAST_PURCHASES;
      sort.updateSorts = () => null;

      sort.init();

      expect(subscribe).to.be.calledWith(Events.PAST_PURCHASE_SORT_UPDATED, sort.updateSorts);
    });

    it('should set up initial state', () => {
      const updateSorts = (sort.updateSorts = spy());

      sort.init();

      expect(updateSorts).to.be.called;
    });
  });

  describe('onUpdate()', () => {
    it('should extract and spread sorts into state', () => {
      const state: any = sort.state = <any>{ a: 'b' };
      const sorts = { c: 'd' };
      const extractSorts = (sort.extractSorts = spy(() => sorts));

      sort.onUpdate();

      expect(sort.state).to.eql({ a: 'b', sorts });
    });
  });

  describe('updateSorts()', () => {
    it('should set sorts', () => {
      const state: any = { a: 'b' };
      const selected = ['c', 'd'];
      const set = (sort.set = spy());
      sort.extractSorts = spy(() => selected);
      sort.flux = <any>{ store: { getState: () => state } };

      sort.updateSorts();

      expect(set).to.be.calledWith({ sorts: selected });
    });
  });

  describe('extractLabels()', () => {
    it('should extract the search labels from props', () => {
      const labels = ['a', 'b', 'c'];
      sort.props = <any>{ labels, storeSection: StoreSections.SEARCH };

      expect(sort.extractLabels()).to.eq(labels);
    });

    it('should extract the search labels from the store', () => {
      const labels = ['foo', 'bar', 'baz'];
      const select = (sort.select = stub().withArgs(Selectors.sorts).returns({ labels }));
      sort.props = <any>{ labels: [], storeSection: StoreSections.SEARCH };

      expect(sort.extractLabels()).to.eq(labels);
    });

    it('should extract the past purchases labels from props', () => {
      const pastPurchasesLabels = ['a', 'b', 'c'];
      sort.props = <any>{ labels: pastPurchasesLabels, storeSection: StoreSections.SEARCH };

      expect(sort.extractLabels()).to.eq(pastPurchasesLabels);
    });

    it('should extract the past purchases labels from the store', () => {
      const pastPurchasesLabels = ['foo', 'bar', 'baz'];
      // tslint:disable-next-line max-line-length
      const select = (sort.select = stub().withArgs(Selectors.pastPurchaseSort).returns({ labels: pastPurchasesLabels }));
      sort.props = <any>{ pastPurchasesLabels: [], storeSection: StoreSections.PAST_PURCHASES };

      expect(sort.extractLabels()).to.eq(pastPurchasesLabels);
    });

    it('should return an empty array of StoreSection is neither search nor past purchases', () => {
      sort.props = <any>{};

      expect(sort.extractLabels()).to.eql([]);
    });
  });

  describe('extractSorts()', () => {
    it('should remap sorts', () => {
      const state = { a: 'b' };
      const labels = ['a', 'b', 'c'];
      const getLabel = (sort.getLabel = spy(() => 'x'));
      const sort1 = { field: 'variant.colour', descending: true };
      const sort2 = { field: 'price' };
      const sort3 = { field: 'size', descending: true };
      const select = (sort.select = spy(() => ({ labels, items: [sort1, sort2, sort3], selected: 1 })));
      const extractLabels = (sort.extractLabels = spy(() => null));
      sort.props.labels = labels;
      sort.props.storeSection = StoreSections.SEARCH;

      const options = sort.extractSorts();

      expect(select).to.be.calledWithExactly(Selectors.sorts);
      expect(extractLabels).to.be.called;
      expect(getLabel).to.be.calledWith(sort1, 0);
      expect(getLabel).to.be.calledWith(sort2, 1);
      expect(getLabel).to.be.calledWith(sort3, 2);
      expect(options).to.eql([
        { label: 'x', selected: false },
        { label: 'x', selected: true },
        { label: 'x', selected: false },
      ]);
    });

    it('should extract and apply labels from the store', () => {
      const labels = ['foo', 'bar', 'baz'];
      const sorts = {
        items: [
          { field: 'a' },
          { field: 'b' },
          { field: 'c' },
        ],
        labels,
      };
      sort.select = stub().withArgs(Selectors.sorts).returns(sorts);
      sort.props.labels = [];
      sort.props.storeSection = StoreSections.SEARCH;

      const options = sort.extractSorts();

      expect(options).to.eql([
        { label: labels[0], selected: false },
        { label: labels[1], selected: false },
        { label: labels[2], selected: false },
      ]);
    });

    it('should remap sorts for pastPurchases', () => {
      const state = { a: 'b' };
      const pastPurchaseLabels = ['a', 'b', 'c'];
      const getLabel = (sort.getLabel = spy(() => 'x'));
      const sort1 = { field: 'variant.colour' };
      const sort2 = { field: 'price' };
      const sort3 = { field: 'size' };
      const select = (sort.select = spy(() => ({
        labels: pastPurchaseLabels,
        items: [sort1, sort2, sort3],
        selected: 1,
      })));
      const extractLabels = (sort.extractLabels = spy(() => null));
      sort.props.pastPurchasesLabels = pastPurchaseLabels;
      sort.props.storeSection = StoreSections.PAST_PURCHASES;

      const options = sort.extractSorts();

      expect(select).to.be.calledWithExactly(Selectors.pastPurchaseSort);
      expect(extractLabels).to.be.called;
      expect(getLabel).to.be.calledWith(sort1);
      expect(getLabel).to.be.calledWith(sort2);
      expect(getLabel).to.be.calledWith(sort3);
      expect(options).to.eql([
        { label: 'x', selected: false },
        { label: 'x', selected: true },
        { label: 'x', selected: false },
      ]);
    });

    it('should extract and apply past purchase labels from the store', () => {
      const labels = ['foo', 'bar', 'baz'];
      const sorts = {
        items: [
          { field: 'a' },
          { field: 'b' },
          { field: 'c' },
        ],
        labels,
      };
      sort.select = stub().withArgs(Selectors.pastPurchaseSort).returns(sorts);
      sort.props.labels = [];
      sort.props.storeSection = StoreSections.PAST_PURCHASES;

      const options = sort.extractSorts();

      expect(options).to.eql([
        { label: labels[0], selected: false },
        { label: labels[1], selected: false },
        { label: labels[2], selected: false },
      ]);
    });
  });

  describe('getLabel()', () => {
    it('should return configured label', () => {
      const labels = ['A', 'B', 'C'];

      expect(sort.getLabel(<any>{}, 2, labels)).to.eq('C');
    });

    it('should generate label', () => {
      const labels = [];

      expect(sort.getLabel({ field: 'age', descending: true }, 2, labels)).to.eq('age Descending');
      expect(sort.getLabel({ field: 'age' }, 2, labels)).to.eq('age Ascending');
    });
  });
});
