import { Actions, Store } from '../../../../../src/core';
import sorts from '../../../../../src/core/reducers/data/sorts';
import suite from '../../../_suite';

suite('sorts', ({ expect }) => {
  const items = [
    { label: 'Price low to high', field: 'price', descending: false },
    { label: 'Price high to low', field: 'price', descending: true },
  ];
  const labels = [
    'Low to High',
    'High to Low',
  ];
  const state: Store.LabeledSelectableList<Store.Sort> = {
    items,
    labels,
    selected: 0,
  };

  describe('updateSorts()', () => {
    it('should update selected state on UPDATE_SORTS', () => {
      const payload = 1;
      const newState = {
        ...state,
        selected: payload,
      };

      const reducer = sorts(state, { type: Actions.SELECT_SORT, payload });

      expect(reducer).to.eql(newState);
    });

    it('should update options, labels, selected state on APPLY_SORTS', () => {
      const options = [
        { field: 'foo' },
        { field: 'bar', descending: false },
        { field: 'baz', descending: true },
      ];
      const newLabels = ['foo', 'bar', 'baz'];
      const selected = 2;
      const payload = {
        options,
        selected,
        labels: newLabels,
      };
      const newState = {
        ...state,
        selected,
        labels: newLabels,
        items: options,
      };

      const reducer = sorts(state, { type: Actions.APPLY_SORTS, payload });

      expect(reducer).to.eql(newState);
    });

    it('should return state on default', () => {
      const reducer = sorts(state, <any>{});

      expect(reducer).to.eql(state);
    });
  });
});
