import { Actions, Store } from '../../../../../src/core';
import navigations from '../../../../../src/core/reducers/data/navigations';
import suite from '../../../_suite';

suite('navigations', ({ expect }) => {
  const allIds = ['Format', 'Section', 'Department'];
  const valueRef = [
    { value: 'Hardcover', count: 200 },
    { value: 'Paper', count: 129 },
    { value: 'Audio Book', count: 293 },
  ];
  const Format = { // tslint:disable-line variable-name
    field: 'format',
    label: 'Format',
    more: true,
    or: true,
    selected: [0, 2],
    refinements: [
      { value: 'Hardcover', total: 200 },
      { value: 'Paper', total: 129 },
      { value: 'Audio Book', total: 293 },
    ],
    metadata: {}
  };
  const Section = { // tslint:disable-line variable-name
    field: 'section',
    label: 'Section',
    more: true,
    or: false,
    selected: [3],
    refinements: [
      { value: 'Books', total: 203 },
      { value: 'Gifts', total: 1231 },
      { value: 'Toys', total: 231 },
      { value: 'Teens', total: 193 },
      { high: 10, low: 5, total: 200 },
    ],
    metadata: {}
  };
  const Department = { // tslint:disable-line variable-name
    field: 'department',
    label: 'Department',
    more: true,
    or: false,
    selected: [],
    refinements: [
      { value: 'first', total: 100 },
      { value: 'second', total: 123 },
    ],
    metadata: {}
  };
  const sort = [{
    name: 'Format',
    values: valueRef
  }, {
    name: 'Section',
    values: [valueRef[0]]
  }];

  const state: Store.AvailableNavigations = {
    allIds,
    byId: {
      Format,
      Section,
      Department,
    },
    sort
  };

  describe('updateNavigations()', () => {
    it('should clear selected refinements state on RESET_REFINEMENTS', () => {
      const newState = {
        ...state,
        byId: {
          Format: {
            ...Format,
            selected: [],
          },
          Section: {
            ...Section,
            selected: [],
          },
          Department,
        },
      };

      const reducer = navigations(state, { type: Actions.RESET_REFINEMENTS, payload: true });

      expect(reducer).to.eql(newState);
    });

    it('should return original refinement for refinements that weren\'t selected on RESET_REFINEMENTS', () => {
      const reducer = navigations(state, { type: Actions.RESET_REFINEMENTS, payload: true });

      expect(reducer.byId.Format).to.not.eq(state.byId.Format);
      expect(reducer.byId.Department).to.eq(state.byId.Department);
    });

    it('should update navigations state on RECEIVE_NAVIGATIONS', () => {
      const newNavs = [
        {
          field: 'colour',
          label: 'Colour',
          more: true,
          or: true,
          selected: [],
          refinements: [
            { value: 'red', total: 23 },
            { value: 'green', total: 199 },
            { value: 'blue', total: 213 },
          ],
          metadata: {}
        }, {
          field: 'size',
          label: 'Size',
          more: false,
          or: false,
          selected: [],
          refinements: [
            { value: 'small', total: 123 },
            { value: 'medium', total: 309 },
            { value: 'large', total: 13 },
          ],
          metadata: {}
        },
      ];
      const newState = {
        ...state,
        allIds: ['colour', 'size'],
        byId: {
          colour: newNavs[0],
          size: newNavs[1],
        },
      };

      const reducer = navigations(state, {
        type: Actions.RECEIVE_NAVIGATIONS,
        payload: newNavs,
      });

      expect(reducer).to.eql(newState);
    });

    it('should sort navigation state on RECEIVE_NAVIGATION_SORT', () => {
      const nav = [{
        name: 'Section',
        values: [{
          value: 'test',
          count: 100
        }]
      }, {
        name: 'Format',
        values: [{
          value: 'another',
          count: 34
        }]
      }, {
        name: 'Extra',
        values: [{
          value: 'another',
          count: 34
        }]
      }];

      const newState = {
        ...state,
        sort: nav,
      };

      const reducer = navigations({ ...state }, {
        type: Actions.RECEIVE_NAVIGATION_SORT,
        payload: nav,
      });

      expect(reducer).to.eql(newState);
    });

    it('should add selected refinement state on SELECT_REFINEMENT', () => {
      const newState = {
        ...state,
        byId: {
          Format,
          Section: {
            ...Section,
            selected: [3, 0],
          },
          Department,
        },
      };

      const reducer = navigations(state, {
        type: Actions.SELECT_REFINEMENT,
        payload: {
          navigationId: 'Section',
          index: 0,
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should add selected refinement state on SELECT_MULTIPLE_REFINEMENTS', () => {
      const newState = {
        ...state,
        byId: {
          Format,
          Section: {
            ...Section,
            selected: [3, 0, 4, 9],
          },
          Department,
        },
      };

      const reducer = navigations(state, {
        type: Actions.SELECT_MULTIPLE_REFINEMENTS,
        payload: {
          navigationId: 'Section',
          indices: [0, 4, 9]
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should not add duplicate indices on SELECT_MULTIPLE_REFINEMENTS', () => {
      const newState = {
        ...state,
        byId: {
          Format,
          Section: {
            ...Section,
            selected: [3, 0, 4, 9],
          },
          Department,
        },
      };

      const reducer = navigations(state, {
        type: Actions.SELECT_MULTIPLE_REFINEMENTS,
        payload: {
          navigationId: 'Section',
          indices: [0, 4, 9, 3]
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should not add duplicate range refinement on ADD_REFINEMENT', () => {
      const newState = {
        ...state,
        byId: {
          ...state.byId,
          Section: {
            ...Section,
            selected: [...Section.selected, 4],
          }
        }
      };

      const reducer = navigations(state, {
        type: Actions.ADD_REFINEMENT,
        payload: {
          navigationId: 'Section',
          range: true,
          high: 10,
          low: 5
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should add value refinement on ADD_REFINEMENT', () => {
      const newState = {
        ...state,
        allIds: ['Format', 'Section', 'Department', 'Brand'],
        byId: {
          Format,
          Section,
          Department,
          Brand: {
            field: 'Brand',
            label: 'Brand',
            range: false,
            refinements: [{ value: 'Oakley' }],
            selected: [0],
            metadata: {}
          }
        }
      };

      const reducer = navigations(state, {
        type: Actions.ADD_REFINEMENT,
        payload: {
          navigationId: 'Brand',
          range: false,
          value: 'Oakley',
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should add range navigation and refinement on ADD_REFINEMENT', () => {
      const newState = {
        ...state,
        allIds: ['Format', 'Section', 'Department', 'Brand'],
        byId: {
          Format,
          Section,
          Department,
          Brand: {
            field: 'Brand',
            label: 'Brand',
            range: true,
            refinements: [{ low: 23, high: 34 }],
            selected: [0],
            metadata: {}
          }
        }
      };

      const reducer = navigations(state, {
        type: Actions.ADD_REFINEMENT,
        payload: {
          navigationId: 'Brand',
          range: true,
          low: 23,
          high: 34
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should add refinement to existing navigation on ADD_REFINEMENT', () => {
      const newState = {
        ...state,
        byId: {
          Section,
          Format: {
            ...Format,
            refinements: [
              ...Format.refinements,
              { value: 'eBook' }
            ],
            selected: [0, 2, 3]
          },
          Department,
        }
      };

      const reducer = navigations(state, {
        type: Actions.ADD_REFINEMENT,
        payload: {
          navigationId: 'Format',
          value: 'eBook'
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should only clear specified navigation on RESET_REFINEMENTS', () => {
      const newState = {
        ...state,
        byId: {
          Section,
          Format: {
            ...Format,
            selected: []
          },
          Department,
        }
      };

      const reducer = navigations(state, {
        type: Actions.RESET_REFINEMENTS,
        payload: 'Format'
      });

      expect(reducer).to.eql(newState);
    });

    it('should select existing refinement on ADD_REFINEMENT', () => {
      const newState = {
        ...state,
        byId: {
          Section,
          Format: {
            ...Format,
            selected: [0, 2, 1]
          },
          Department,
        }
      };

      const reducer = navigations(state, {
        type: Actions.ADD_REFINEMENT,
        payload: {
          navigationId: 'Format',
          range: false,
          value: 'Paper'
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should return state on RESET_REFINEMENTS if no navigationId and payload clear is truth', () => {
      const newState = {
        ...state,
        byId: {
          Section: {
            ...Section,
            selected: []
          },
          Format: {
            ...Format,
            selected: []
          },
          Department,
        }
      };

      const reducer = navigations(state, {
        type: Actions.RESET_REFINEMENTS,
        payload: true
      });

      expect(reducer).to.eql(newState);
    });

    it('should remove selected refinement state on DESELECT_REFINEMENT', () => {
      const newState = {
        ...state,
        byId: {
          Format: {
            ...Format,
            selected: [2],
          },
          Section,
          Department,
        },
      };

      const reducer = navigations(state, {
        type: Actions.DESELECT_REFINEMENT,
        payload: {
          navigationId: 'Format',
          index: 0,
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should return state on DESELECT_REFINEMENT if no navigationId and refinementIndex', () => {
      const reducer = navigations(state, <any>{
        type: Actions.DESELECT_REFINEMENT,
        payload: {}
      });

      expect(reducer).to.eq(state);
    });

    it('should update refinements state on RECEIVE_MORE_REFINEMENTS', () => {
      const selected = [0, 3, 4];
      const refinements = [
        { value: 'Paper back', total: 400 },
        { value: 'ebook', total: 2000 },
      ];
      const newState = {
        ...state,
        byId: {
          Format: {
            ...Format,
            more: false,
            refinements,
            selected
          },
          Section,
          Department,
        },
      };

      const reducer = navigations(state, {
        type: Actions.RECEIVE_MORE_REFINEMENTS,
        payload: {
          navigationId: 'Format',
          refinements,
          selected,
        }
      });

      expect(reducer).to.eql(newState);
    });

    it('should return state on RECEIVE_MORE_REFINEMENTS if no navigationId and refinements', () => {
      const reducer = navigations(state, <any>{
        type: Actions.RECEIVE_MORE_REFINEMENTS,
        payload: {}
      });

      expect(reducer).to.eq(state);
    });

    it('should return state on default', () => {
      const reducer = navigations(state, <any>{});

      expect(reducer).to.eq(state);
    });
  });
});
