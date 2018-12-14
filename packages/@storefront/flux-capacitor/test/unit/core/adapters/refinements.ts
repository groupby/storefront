import Adapter from '../../../../src/core/adapters/refinements';
import Search from '../../../../src/core/adapters/search';
import Selectors from '../../../../src/core/selectors';
import suite from '../../_suite';

suite('Refinements Adapter', ({ expect, stub }) => {
  describe('mergePastPurchaseRefinements', () => {
    let extractRefinementsStub;
    let pastPurchaseNav;
    let pastPurchaseNavigationStub;

    beforeEach(() => {
      extractRefinementsStub = stub(Adapter, 'extractRefinements').returns({ refinements: [], selected: [] });
      pastPurchaseNav = { foo: 'bar' };
      pastPurchaseNavigationStub = stub(Selectors, 'pastPurchaseNavigation').returns(pastPurchaseNav);
    });

    afterEach(() => {
      extractRefinementsStub.restore();
      pastPurchaseNavigationStub.restore();
    });

    it('should call extractRefinements() with the correct selector', () => {
      const navigationId = 'foo';
      const refinements = ['a', 'b'];
      const data = <any>{ navigation: { name: navigationId, refinements } };
      const state = <any>{ a: 'b' };

      const result = Adapter.mergePastPurchaseRefinements(data, state);

      expect(result).to.eql({ navigationId, refinements: [], selected: [] });
      expect(pastPurchaseNavigationStub).to.be.calledWithExactly(state, navigationId);
      expect(extractRefinementsStub).to.be.calledWithExactly(pastPurchaseNav, refinements);
    });
  });

  describe('mergeRefinements', () => {
    let extractRefinementsStub;
    let nav;
    let navigationStub;

    beforeEach(() => {
      extractRefinementsStub = stub(Adapter, 'extractRefinements').returns({ refinements: [], selected: [] });
      nav = { foo: 'bar' };
      navigationStub = stub(Selectors, 'pastPurchaseNavigation').returns(nav);
    });

    afterEach(() => {
      extractRefinementsStub.restore();
      navigationStub.restore();
    });

    it('should call extractRefinements() with the correct selector', () => {
      const navigationId = 'foo';
      const refinements = ['a', 'b'];
      const data = <any>{ navigation: { name: navigationId, refinements } };
      const state = <any>{ a: 'b' };

      const result = Adapter.mergePastPurchaseRefinements(data, state);

      expect(result).to.eql({ navigationId, refinements: [], selected: [] });
      expect(navigationStub).to.be.calledWithExactly(state, navigationId);
      expect(extractRefinementsStub).to.be.calledWithExactly(nav, refinements);
    });
  });

  describe('extractRefinements()', () => {
    it('should merge refinements', () => {
      const refinements = ['a', 'b', 'c', 'd'];
      const navigation = { range: false, refinements: ['g', 'h', 'i', 'j'], selected: [1, 3] };
      const extractRefinement = stub(Search, 'extractRefinement').returns('x');
      const refinementsMatch = stub(Search, 'refinementsMatch').returns(true);

      const { refinements: extractedRefinements, selected } = Adapter.extractRefinements(navigation, refinements);

      expect(extractedRefinements).to.eql(['x', 'x', 'x', 'x']);
      expect(selected).to.eql([0, 1, 2, 3]);
      expect(extractRefinement).to.have.callCount(4)
        .and.calledWith('a')
        .and.calledWith('b')
        .and.calledWith('d')
        .and.calledWith('c');
      expect(refinementsMatch).to.have.callCount(4)
        .and.calledWith('x', 'h', 'Value');
    });

    it('should not select non-matching refinements', () => {
      const refinements = ['a', 'b', 'c', 'd'];
      const navigation = { range: false, refinements: ['g', 'h', 'i', 'j'], selected: [1, 3] };
      const extractRefinement = stub(Search, 'extractRefinement').returns('x');
      const refinementsMatch = stub(Search, 'refinementsMatch').returns(false);

      const { refinements: extractedRefinements, selected } = Adapter.extractRefinements(navigation, refinements);

      expect(selected).to.eql([]);
      expect(extractedRefinements).to.eql(['x', 'x', 'x', 'x']);
      expect(extractRefinement).to.have.callCount(4)
        .and.calledWith('a')
        .and.calledWith('b')
        .and.calledWith('d')
        .and.calledWith('c');
      expect(refinementsMatch).to.have.callCount(8)
        .and.calledWith('x', 'h', 'Value');
    });

    it('should merge range refinements', () => {
      const refinements = ['a', 'b', 'c', 'd'];
      const navigation = { range: true, refinements: ['g', 'h', 'i', 'j'], selected: [1, 3] };
      const extractRefinement = stub(Search, 'extractRefinement').returns('x');
      const refinementsMatch = stub(Search, 'refinementsMatch').returns(true);

      const { refinements: extractedRefinements, selected } = Adapter.extractRefinements(navigation, refinements);

      expect(extractedRefinements).to.eql(['x', 'x', 'x', 'x']);
      expect(selected).to.eql([0, 1, 2, 3]);
      expect(extractRefinement).to.have.callCount(4)
        .and.calledWith('a')
        .and.calledWith('b')
        .and.calledWith('d')
        .and.calledWith('c');
      expect(refinementsMatch).to.have.callCount(4)
        .and.calledWith('x', 'h', 'Range');
    });
  });
});
