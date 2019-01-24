import * as validators from '../../../../src/core/actions/validators';
import Selectors from '../../../../src/core/selectors';
import suite from '../../_suite';

suite('validators', ({ expect, spy, stub }) => {

  describe('isString', () => {
    const validator = validators.isString;

    it('should be valid if value is a string', () => {
      expect(validator.func('test')).to.be.true;
    });

    it('should be invalid if value is an empty string', () => {
      expect(validator.func('')).to.be.false;
      expect(validator.func(' ')).to.be.false;
      expect(validator.func(<any>false)).to.be.false;
    });
  });

  describe('isValidQuery', () => {
    it('should use isString validator', () => {
      const query = 'rambo';
      const isString = stub(validators.isString, 'func').returns(true);

      expect(validators.isValidQuery.func(query)).to.be.true;
      expect(isString).to.be.calledWithExactly(query);
    });

    it('should be valid if null', () => {
      expect(validators.isValidQuery.func(null)).to.be.true;
    });
  });

  describe('isValidClearField', () => {
    it('should use isString validator', () => {
      const field = 'brand';
      const isString = stub(validators.isString, 'func').returns(true);

      expect(validators.isValidClearField.func(field)).to.be.true;
      expect(isString).to.be.calledWithExactly(field);
    });

    it('should be valid if true', () => {
      expect(validators.isValidClearField.func(true)).to.be.true;
    });

    it('should be invalid if falsey', () => {
      expect(validators.isValidClearField.func()).to.be.false;
      expect(validators.isValidClearField.func(undefined)).to.be.false;
      expect(validators.isValidClearField.func(null)).to.be.false;
    });
  });

  describe('hasSelectedRefinements', () => {
    it('should be valid if existing selected refinements', () => {
      stub(Selectors, 'selectedRefinements').returns(['a']);

      expect(validators.hasSelectedRefinements.func()).to.be.true;
    });

    it('should be invalid if no existing selected refinements', () => {
      stub(Selectors, 'selectedRefinements').returns([]);

      expect(validators.hasSelectedRefinements.func()).to.be.false;
    });
  });

  describe('hasSelectedRefinementsByField', () => {
    it('should be valid if existing selected refinements for field', () => {
      const field = 'size';
      const state: any = { a: 'b' };
      const navigation = stub(Selectors, 'navigation').returns({ selected: ['a'] });

      expect(validators.hasSelectedRefinementsByField.func(field, state)).to.be.true;
      expect(navigation).to.be.calledWithExactly(state, field);
    });

    it('should be invalid if no existing selected refinements for field', () => {
      stub(Selectors, 'navigation').returns({ selected: [] });

      expect(validators.hasSelectedRefinementsByField.func()).to.be.false;
    });
  });

  describe('notOnFirstPage', () => {
    it('should be valid if current page is not 1', () => {
      stub(Selectors, 'page').returns(9);

      expect(validators.notOnFirstPage.func()).to.be.true;
    });

    it('should be invalid if current page is 1', () => {
      stub(Selectors, 'page').returns(1);

      expect(validators.notOnFirstPage.func()).to.be.false;
    });
  });

  describe('isRangeRefinement', () => {
    it('should be valid if low and high are numeric', () => {
      expect(validators.isRangeRefinement.func(<any>{ range: true, low: 20, high: 40 })).to.be.true;
    });

    it('should be valid if not a range refinement', () => {
      expect(validators.isRangeRefinement.func(<any>{ range: false })).to.be.true;
    });

    it('should be invalid if low or high are non-numeric', () => {
      expect(validators.isRangeRefinement.func(<any>{ range: true, low: 20, high: true })).to.be.false;
      expect(validators.isRangeRefinement.func(<any>{ range: true, low: '3', high: 31 })).to.be.false;
      expect(validators.isRangeRefinement.func(<any>{ range: true, low: 2 })).to.be.false;
      expect(validators.isRangeRefinement.func(<any>{ range: true, high: 2 })).to.be.false;
      expect(validators.isRangeRefinement.func(<any>{ range: true })).to.be.false;
    });
  });

  describe('isValidRange', () => {
    it('should be valid if low value is lower than high value', () => {
      expect(validators.isValidRange.func(<any>{ range: true, low: 30, high: 40 })).to.be.true;
      expect(validators.isValidRange.func(<any>{ range: true, low: 30, high: 40 })).to.be.true;
    });

    it('should be valid if not range refinement', () => {
      expect(validators.isValidRange.func(<any>{ range: false })).to.be.true;
    });

    it('should be invalid if low value is higher than or equal to high value', () => {
      expect(validators.isValidRange.func(<any>{ range: true, low: 50, high: 40 })).to.be.false;
      expect(validators.isValidRange.func(<any>{ range: true, low: 40, high: 40 })).to.be.false;
    });
  });

  describe('isValueRefinement', () => {
    it('should use isString validator', () => {
      const value = 'brand';
      const isString = stub(validators.isString, 'func').returns(true);

      expect(validators.isValueRefinement.func(<any>{ value })).to.be.true;
      expect(isString).to.be.calledWithExactly(value);
    });

    it('should be valid if range refinement', () => {
      expect(validators.isValueRefinement.func(<any>{ range: true })).to.be.true;
    });

    it('should be invalid if not a range refinement', () => {
      expect(validators.isValueRefinement.func(<any>{ range: false })).to.be.false;
    });
  });

  describe('isRefinementDeselectedByValue', () => {
    const navigationId = 'brand';

    it('should be valid if no matching navigation', () => {
      const state: any = { a: 'b' };
      const navigation = stub(Selectors, 'navigation');

      expect(validators.isRefinementDeselectedByValue.func({ navigationId }, state)).to.be.true;
      expect(navigation).to.be.calledWithExactly(state, navigationId);
    });

    it('should be valid if no matching range refinement in navigation', () => {
      stub(Selectors, 'navigation').returns({ selected: [1], refinements: [{}, { value: 'boar' }] });

      expect(validators.isRefinementDeselectedByValue.func({ navigationId, value: 'bear' })).to.be.true;
    });

    it('should be valid if no matching value refinement in navigation', () => {
      stub(Selectors, 'navigation').returns({ range: true, selected: [1], refinements: [{}, { low: 4, high: 4 }] });

      expect(validators.isRefinementDeselectedByValue.func({ navigationId, low: 4, high: 8 })).to.be.true;
    });

    it('should be invalid matching refinement exists already', () => {
      const value = 'bear';
      stub(Selectors, 'navigation').returns({ selected: [1], refinements: [{}, { value }] });

      expect(validators.isRefinementDeselectedByValue.func({ navigationId, value })).to.be.false;
    });
  });

  describe('isRefinementDeselectedByIndex', () => {
    const navigationId = 'colour';
    const index = 8;

    it('should be valid if refinement is deselected', () => {
      const state: any = { a: 'b' };
      stub(Selectors, 'navigation').withArgs(state, navigationId).returns({ selected: [index + 2, index + 3] });

      expect(validators.isRefinementDeselectedByIndex.func({ navigationId, index }, state)).to.be.true;
    });

    it('should be invalid if refinement is selected', () => {
      const state: any = { a: 'b' };
      stub(Selectors, 'navigation').withArgs(state, navigationId).returns({ selected: [index + 2, index, index + 3] });

      expect(validators.isRefinementDeselectedByIndex.func({ navigationId, index }, state)).to.be.false;
    });

    it('should be invalid if navigationId is not present', () => {
      const state: any = { a: 'b' };

      expect(validators.isRefinementDeselectedByIndex.func(<any>{ index }, state)).to.be.false;
    });
  });

  describe('areMultipleRefinementsDeselectedByIndex', () => {
    const navigationId = 'colour';

    it('should be valid if some refinements are deselected', () => {
      const state: any = { a: 'b' };
      stub(Selectors, 'navigation').withArgs(state, navigationId).returns({ selected: [2, 4, 6, 8] });

      // tslint:disable-next-line max-line-length
      expect(validators.areMultipleRefinementsDeselectedByIndex.func({ navigationId, indices: [1, 2, 3, 4, 5, 6, 7, 8] }, state)).to.be.true;
    });

    it('should be invalid if all refinements are selected', () => {
      const state: any = { a: 'b' };
      const selectedRefinements = [1, 2, 3, 4, 5, 6, 7];
      stub(Selectors, 'navigation').withArgs(state, navigationId).returns({ selected: [...selectedRefinements] });

      // tslint:disable-next-line max-line-length
      expect(validators.areMultipleRefinementsDeselectedByIndex.func({ navigationId, indices: [...selectedRefinements] }, state)).to.be.false;
    });

    it('should be invalid if indices array is empty', () => {
      const state: any = { a: 'b' };
      const indices = [];

      expect(validators.areMultipleRefinementsDeselectedByIndex.func({ navigationId, indices }, state)).to.be.false;
    });

    it('should be invalid if navigationId is not present', () => {
      const state: any = { a: 'b' };
      const indices = [1, 2, 3, 4, 5, 6, 7];

      expect(validators.areMultipleRefinementsDeselectedByIndex.func(<any>{ indices }, state)).to.be.false;
    });
  });

  describe('isRefinementSelectedByIndex', () => {
    const navigationId = 'colour';
    const index = 8;

    it('should be valid if refinement is selected', () => {
      const state: any = { a: 'b' };
      stub(Selectors, 'navigation').withArgs(state, navigationId).returns({ selected: [index + 2, index, index + 3] });

      expect(validators.isRefinementSelectedByIndex.func({ navigationId, index }, state)).to.be.true;
    });

    it('should be invalid if refinement is deselected', () => {
      const state: any = { a: 'b' };
      stub(Selectors, 'navigation').withArgs(state, navigationId).returns({ selected: [index + 2, index + 3] });

      expect(validators.isRefinementSelectedByIndex.func({ navigationId, index }, state)).to.be.false;
    });
  });

  describe('isPastPurchaseRefinementDeselectedByIndex', () => {
    const navigationId = 'colour';
    const index = 8;

    it('should be valid if refinement is deselected', () => {
      const state: any = { a: 'b' };
      const deselect = stub(Selectors, 'isPastPurchaseRefinementDeselected').returns(true);

      expect(validators.isPastPurchaseRefinementDeselectedByIndex.func({ navigationId, index }, state)).to.be.true;
      expect(deselect).to.be.calledWithExactly(state, navigationId, index);
    });

    it('should be invalid if refinement selected', () => {
      stub(Selectors, 'isPastPurchaseRefinementDeselected').returns(false);

      expect(validators.isPastPurchaseRefinementDeselectedByIndex.func({ navigationId, index })).to.be.false;
    });
  });

  describe('areMultiplePastPurchaseRefinementsDeselectedByIndex', () => {
    const navigationId = 'color';

    it('should be valid if some refinements are deselected', () => {
      const state: any = { a: 'b' };
      stub(Selectors, 'pastPurchaseNavigation').withArgs(state, navigationId).returns({ selected: [4, 5, 6, 7] });

      // tslint:disable-next-line max-line-length
      expect(validators.areMultiplePastPurchaseRefinementsDeselectedByIndex.func({ navigationId, indices: [1, 2, 3, 4, 5, 6, 7] }, state)).to.be.true;
    });

    it('should be invalid if all refinements are selected', () => {
      const state: any = { a: 'b' };
      const selectedRefinements = [1, 2, 3, 4, 5, 6, 7, 8];
      // tslint:disable-next-line max-line-length
      stub(Selectors, 'pastPurchaseNavigation').withArgs(state, navigationId).returns({ selected: [...selectedRefinements] });

      // tslint:disable-next-line max-line-length
      expect(validators.areMultiplePastPurchaseRefinementsDeselectedByIndex.func({ navigationId, indices: [...selectedRefinements] }, state)).to.be.false;
    });

    it('should be invalid if indices array is empty', () => {
      const state: any = { a: 'b' };
      const indices = [];

      // tslint:disable-next-line max-line-length
      expect(validators.areMultiplePastPurchaseRefinementsDeselectedByIndex.func({ navigationId, indices }, state)).to.be.false;
    });
  });

  describe('isPastPurchaseRefinementSelectedByIndex', () => {
    const navigationId = 'colour';
    const index = 8;

    it('should be valid if refinement is selected', () => {
      const state: any = { a: 'b' };
      const select = stub(Selectors, 'isPastPurchaseRefinementSelected').returns(true);

      expect(validators.isPastPurchaseRefinementSelectedByIndex.func({ navigationId, index }, state)).to.be.true;
      expect(select).to.be.calledWithExactly(state, navigationId, index);
    });

    it('should be invalid if refinement is selected', () => {
      stub(Selectors, 'isPastPurchaseRefinementSelected').returns(false);

      expect(validators.isPastPurchaseRefinementSelectedByIndex.func({ navigationId, index })).to.be.false;
    });
  });

  describe('notOnFirstPastPurchasePage', () => {
    const state: any = { a: 'b' };

    it('should be valid if page is not equal to 1', () => {
      const pastPurchasePage = stub(Selectors, 'pastPurchasePage').returns(2);

      expect(validators.notOnFirstPastPurchasePage.func(<any>{}, state)).to.be.true;
      expect(pastPurchasePage).to.be.calledWithExactly(state);
    });

    it('should be invalid if page is equal to 1', () => {
      stub(Selectors, 'pastPurchasePage').returns(1);

      expect(validators.notOnFirstPastPurchasePage.func(<any>{}, state)).to.be.false;
    });
  });

  describe('isDifferentPastPurchasePageSize', () => {
    const state: any = { a: 'b' };

    it('should be valid if page sizes are different', () => {
      const pastPurchasePageSize = stub(Selectors, 'pastPurchasePageSize').returns(5);

      expect(validators.isDifferentPastPurchasePageSize.func(6, state)).to.be.true;
      expect(pastPurchasePageSize).to.be.calledWithExactly(state);
    });

    it('should be invalid if page sizes are equal', () => {
      stub(Selectors, 'pastPurchasePageSize').returns(5);

      expect(validators.isDifferentPastPurchasePageSize.func(5, state)).to.be.false;
    });
  });

  describe('isOnDifferentPastPurchasePage', () => {
    const state: any = { a: 'b' };

    it('should be valid if page sizes are different', () => {
      const pastPurchasePage = stub(Selectors, 'pastPurchasePage').returns(5);

      expect(validators.isOnDifferentPastPurchasePage.func(6, state)).to.be.true;
      expect(pastPurchasePage).to.be.calledWithExactly(state);
    });

    it('should be invalid if page sizes are equal', () => {
      stub(Selectors, 'pastPurchasePage').returns(5);

      expect(validators.isOnDifferentPastPurchasePage.func(5, state)).to.be.false;
    });
  });

  describe('isValidPastPurchasePage', () => {
    const state: any = { a: 'b' };

    it('should be valid if page is within range', () => {
      const pastPurchaseTotalPages = stub(Selectors, 'pastPurchaseTotalPages').returns(5);

      expect(validators.isValidPastPurchasePage.func(3, state)).to.be.true;
      expect(pastPurchaseTotalPages).to.be.calledWithExactly(state);
    });

    it('should be invalid if page is not within range', () => {
      stub(Selectors, 'pastPurchaseTotalPages').returns(5);

      expect(validators.isValidPastPurchasePage.func(500, state)).to.be.false;
    });
  });

  describe('hasSelectedPastPurchaseRefinements', () => {
    const state: any = { a: 'b' };

    it('should be valid if number selected is not 0', () => {
      const pastPurchaseSelectedRefinements =
        stub(Selectors, 'pastPurchaseSelectedRefinements').returns({ length: 1 });

      expect(validators.hasSelectedPastPurchaseRefinements.func(<any>{}, state)).to.be.true;
      expect(pastPurchaseSelectedRefinements).to.be.calledWithExactly(state);
    });

    it('should be invalid if number selected is 0', () => {
      stub(Selectors, 'pastPurchaseSelectedRefinements').returns({ length: 0 });

      expect(validators.hasSelectedPastPurchaseRefinements.func(<any>{}, state)).to.be.false;
    });
  });

  describe('hasSelectedPastPurchaseRefinementsByField', () => {
    const state: any = { a: 'b' };
    const field = 'hat';

    it('should be valid if number selected is not 0', () => {
      const pastPurchaseNavigation =
        stub(Selectors, 'pastPurchaseNavigation').returns({ selected: { length: 1 } });

      expect(validators.hasSelectedPastPurchaseRefinementsByField.func(field, state)).to.be.true;
      expect(pastPurchaseNavigation).to.be.calledWithExactly(state, field);
    });

    it('should be invalid if number selected is 0', () => {
      stub(Selectors, 'pastPurchaseNavigation').returns({ selected: { length: 0 } });

      expect(validators.hasSelectedPastPurchaseRefinementsByField.func(field, state)).to.be.false;
    });

    it('should be valid if field is a boolean', () => {
      stub(Selectors, 'pastPurchaseNavigation').returns({ selected: { length: 0 } });

      expect(validators.hasSelectedPastPurchaseRefinementsByField.func(<any>true, state)).to.be.true;
    });

  });

  describe('isPastPurchasesSortValid', () => {
    const state: any = { a: 'b' };
    const index = 2;

    it('should be valid if index selected is a number', () => {
      const pastPurchaseSort = stub(Selectors, 'pastPurchaseSort').returns({ items: [ 'a', 'b', 'c' ] });

      expect(validators.isPastPurchasesSortValid.func(index, state)).to.be.true;
      expect(pastPurchaseSort).to.be.calledWithExactly(state);
    });

    [
      'foo',
      true,
      {},
      () => null,
      undefined,
    ].forEach((val) => {
      it(`should be invalid if index is of type ${typeof val}`, () => {
        expect(validators.isPastPurchasesSortValid.func(<any>val, state)).to.be.false;
      });
    });
  });
  describe('isCollectionDeselected', () => {
    const collection = 'alternative';

    it('should be valid if collection is deselected', () => {
      const state: any = { a: 'b' };
      const isCollectionDeselected = stub(Selectors, 'collection').returns('main');

      expect(validators.isCollectionDeselected.func(collection, state)).to.be.true;
      expect(isCollectionDeselected).to.be.calledWithExactly(state);
    });

    it('should be invalid if collection is selected', () => {
      stub(Selectors, 'collection').returns(collection);

      expect(validators.isCollectionDeselected.func(collection)).to.be.false;
    });
  });

  describe('isSortValid', () => {
    const index = 2;
    const state: any = { a: 'b' };

    it('should be valid if sort is a valid index number', () => {
      const sorts = stub(Selectors, 'sorts').returns({ items: [ 'a', 'b', 'c' ] });

      expect(validators.isSortValid.func(index, state)).to.be.true;
      expect(sorts).to.be.calledWithExactly(state);
    });

    [
      'foo',
      true,
      {},
      () => null,
      undefined,
    ].forEach((val) => {
      it(`should be invalid if index is of type ${typeof val}`, () => {
        expect(validators.isSortValid.func(<any>val, state)).to.be.false;
      });
    });
  });

  describe('isDifferentPageSize', () => {
    const pageSize = 25;

    it('should be valid if page size is different', () => {
      const state: any = { a: 'b' };
      const pageSizeSelector = stub(Selectors, 'pageSize').returns(12);

      expect(validators.isDifferentPageSize.func(pageSize, state)).to.be.true;
      expect(pageSizeSelector).to.be.calledWithExactly(state);
    });

    it('should be invalid if page size is the same', () => {
      stub(Selectors, 'pageSize').returns(pageSize);

      expect(validators.isDifferentPageSize.func(pageSize)).to.be.false;
    });
  });

  describe('isOnDifferentPage', () => {
    const page = 3;

    it('should be valid if page is different not the current page', () => {
      const state: any = { a: 'b' };
      const pageSelector = stub(Selectors, 'page').returns(4);

      expect(validators.isOnDifferentPage.func(page, state)).to.be.true;
      expect(pageSelector).to.be.calledWithExactly(state);
    });

    it('should be invalid if page is the current page', () => {
      stub(Selectors, 'page').returns(page);

      expect(validators.isOnDifferentPage.func(page)).to.be.false;
    });
  });

  describe('isValidPage', () => {
    const page = 10;

    it('should be valid if number is in range', () => {
      stub(Selectors, 'totalPages').returns(55);

      expect(validators.isValidPage.func(page)).to.be.true;
    });

    it('should be invalid if number is out of range', () => {
      stub(Selectors, 'totalPages').returns(55);

      expect(validators.isValidPage.func(300)).to.be.false;
    });

    it('should be invalid if page is null', () => {
      expect(validators.isValidPage.func(null)).to.be.false;
    });
  });

  describe('isDifferentAutocompleteQuery', () => {
    const query = 'red apple';

    it('should be valid if autocomplete query is different', () => {
      const state: any = { a: 'b' };
      const autocompleteQuery = stub(Selectors, 'autocompleteQuery').returns('orange');

      expect(validators.isDifferentAutocompleteQuery.func(query, state)).to.be.true;
      expect(autocompleteQuery).to.be.calledWithExactly(state);
    });

    it('should be invalid if autocomplete query is the same', () => {
      stub(Selectors, 'autocompleteQuery').returns(query);

      expect(validators.isDifferentAutocompleteQuery.func(query)).to.be.false;
    });
  });

  describe('isValidBias', () => {
    it('should be invalid if payload is falsy', () => {
      const payload = false;

      expect(validators.isValidBias.func(<any>payload)).to.be.false;
    });

    it('should be invalid if payload.value is falsy and payload.field is falsy', () => {
      const payload = {};

      expect(validators.isValidBias.func(<any>payload)).to.be.false;
    });

    it('should be invalid if payload.value is falsy', () => {
      const payload = {
        field: 'asdf',
        value: false
      };

      expect(validators.isValidBias.func(<any>payload)).to.be.false;
    });

    it('should be invalid if payload.field is falsy', () => {
      const payload = {
        value: 'asdf',
        field: false
      };

      expect(validators.isValidBias.func(<any>payload)).to.be.false;
    });

    it('should be valid if payload.value is truthy and payload.field is truthy', () => {
      const payload = {
        value: 'asdf',
        field: 'asdf2'
      };

      expect(validators.isValidBias.func(<any>payload)).to.be.true;
    });
  });

  describe('isNotFullRange', () => {
    const low = 4;
    const high = 8;
    const range = true;
    const navigationId = 'a';
    const payload = {
      navigationId,
      range,
      low,
      high
    };
    const state: any = { a: 'b' };

    it('should be valid if it is not full range', () => {
      stub(Selectors, 'rangeNavigationMax').returns(high);
      stub(Selectors, 'rangeNavigationMin').returns(low + 1);

      expect(validators.isNotFullRange.func(payload, state)).to.be.true;
    });

    it('should be invalid if it is full range', () => {
      stub(Selectors, 'rangeNavigationMax').returns(high);
      stub(Selectors, 'rangeNavigationMin').returns(low);

      expect(validators.isNotFullRange.func(payload, state)).to.be.false;
    });
  });

  describe('isNotFetching', () => {
    const state: any = { a: 'b' };

    it('should be valid if it is not fetching forward', () => {
      const forward = true;
      stub(Selectors, 'infiniteScroll').returns({ isFetchingForward: false });

      expect(validators.isNotFetching.func(forward, state)).to.be.true;
    });

    it('should be valid if it is not fetching backward', () => {
      const forward = false;
      stub(Selectors, 'infiniteScroll').returns({ isFetchingBackward: false });

      expect(validators.isNotFetching.func(forward, state)).to.be.true;
    });
  });

  describe('hasValidLabels', () => {
    it('should be valid if labels is not present', () => {
      expect(validators.hasValidLabels.func(<any>{})).to.be.true;
    });

    it('should be valid if labels is an array of strings', () => {
      expect(validators.hasValidLabels.func(<any>{ labels: ['a', 'b'] })).to.be.true;
    });

    it('should be valid if labels is an empty array', () => {
      expect(validators.hasValidLabels.func(<any>{ labels: [] })).to.be.true;
    });

    it('should be invalid if labels is an array of anything other than strings', () => {
      expect(validators.hasValidLabels.func(<any>{ labels: [{ foo: 'baz' }, 'bar'] })).to.be.false;
    });
  });

  describe('hasValidOptions', () => {
    it('should be valid if options is an array of objects with the required fields', () => {
      const payload: any = {
        options: [
          { field: 'foo' },
          { field: 'bar', descending: false },
          { field: 'baz', descending: true },
        ],
      };

      expect(validators.hasValidOptions.func(payload)).to.be.true;
    });

    [
      'foo',
      1,
      true,
      {},
      () => null,
      undefined,
    ].forEach((val) => {
      it(`should be invalid if options is of type ${typeof val}`, () => {
        expect(validators.hasValidOptions.func(<any>{ options: val })).to.be.false;
      });
    });

    it('should be invalid if options is an empty array', () => {
      expect(validators.hasValidOptions.func(<any>{ options: [] })).to.be.false;
    });

    it('should be invalid if any of the options are missing the `field` key', () => {
      const payload: any = {
        options: [{ field: 'foo' }, { field: 'bar' }, { baz: 'quux' }],
      };

      expect(validators.hasValidOptions.func(<any>payload)).to.be.false;
    });

    it('should be invalid if any of the options contain a non-boolean value for `descending`', () => {
      const payload: any = {
        options: [{ field: 'foo', descending: true }, { field: 'bar', descending: 'baz' }],
      };

      expect(validators.hasValidOptions.func(<any>payload)).to.be.false;
    });
  });

  describe('hasValidSelected', () => {
    it('should be valid if selected is not present', () => {
      expect(validators.hasValidSelected.func(<any>{})).to.be.true;
    });

    it('should be valid if selected is a number between 0 and options.length - 1', () => {
      expect(validators.hasValidSelected.func(<any>{
        options: ['a', 'b', 'c'],
        selected: 0,
      })).to.be.true;
    });

    it('should be invalid if selected is less than 0', () => {
      expect(validators.hasValidSelected.func(<any>{
        options: ['a', 'b', 'c'],
        selected: -1,
      })).to.be.false;
    });

    it('should be invalid if selected is beyond the end of the options array', () => {
      expect(validators.hasValidSelected.func(<any>{
        options: ['a', 'b', 'c'],
        selected: 3,
      })).to.be.false;
    });

    [
      'foo',
      true,
      {},
      () => null,
      undefined,
    ].forEach((val) => {
      it(`should be invalid if selected is of type ${typeof val}`, () => {
        expect(validators.hasValidSelected.func(<any>{
          options: ['a', 'b', 'c'],
          selected: val,
        })).to.be.false;
      });
    });
  });
});
