import { Events, Selectors } from '@storefront/core';
import RecordCount from '../../src/record-count';
import suite from './_suite';

suite('RecordCount', ({ expect, stub, spy, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let recordCount: RecordCount;

  beforeEach(() => {
    RecordCount.prototype.flux = <any>{};
    recordCount = new RecordCount();
  });

  itShouldBeConfigurable(RecordCount);
  itShouldProvideAlias(RecordCount, 'recordCount');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set default props', () => {
        expect(recordCount.props).to.eql({ labels: { noResults: 'No results found' }, limitCount: false });
      });
    });
  });

  describe('init()', () => {
    it('should listen for events', () => {
      const subscribe = (recordCount.subscribe = spy());
      const updatePageRange = (recordCount.updatePageRange = spy());
      const select = (recordCount.select = spy());
      recordCount.updateRecordCount = () => null;
      recordCount.updateQuery = () => null;

      recordCount.init();

      expect(subscribe).to.be.calledWith(Events.RECORD_COUNT_UPDATED, recordCount.updateRecordCount);
      expect(subscribe).to.be.calledWith(Events.PAGE_UPDATED, updatePageRange);
      expect(updatePageRange).to.be.calledOnce;
      expect(select).to.be.calledWithExactly(Selectors.pageObject);
    });

    it('should set default state', () => {
      const query = 'eyyo';
      const total = 789;
      recordCount.getTotal = stub().returns(total);
      recordCount.select = stub().withArgs(Selectors.currentQuery).returns(query);
      recordCount.subscribe = stub();
      recordCount.updatePageRange = stub();
      recordCount.init();

      expect(recordCount.state).to.eql({ query, total });
    });
  });

  describe('updateRecordCount()', () => {
    it('should set total', () => {
      const total = 47;
      const set = (recordCount.set = spy());
      const getTotal = (recordCount.getTotal = spy(() => total));

      recordCount.updateRecordCount(total);

      expect(getTotal).to.be.called;
      expect(set).to.be.calledWithExactly({ total });
    });
  });

  describe('updatePageRange()', () => {
    it('should set total', () => {
      const from = 30;
      const to = 50;
      const set = (recordCount.set = spy());

      recordCount.updatePageRange(<any>{ from, to, a: 'b' });

      expect(set).to.be.calledWith({ to, from, hasResults: true });
    });
  });

  describe('updateQuery()', () => {
    it('should set query', () => {
      const query = 'ok';
      const set = (recordCount.set = spy());
      const select = (recordCount.select = spy(() => query));

      recordCount.updateQuery();

      expect(select).to.be.calledWith(Selectors.currentQuery);
      expect(set).to.be.calledWith({ query });
    });
  });

  describe('getTotal()', () => {
    it('should set return selector record count', () => {
      const count = 1000000;
      const select = (recordCount.select = spy(() => count));
      recordCount.props.limitCount = false;

      expect(recordCount.getTotal()).to.eq(count);
      expect(select).calledWithExactly(Selectors.recordCount);
    });

    it('should set return limited record count', () => {
      const count = 1000000;
      const stringCount = '10000+';
      const select = (recordCount.select = spy(() => count));
      const getLimitedCountDisplay = stub(Selectors, 'getLimitedCountDisplay').returns(stringCount);
      recordCount.props.limitCount = true;

      expect(recordCount.getTotal()).to.eq(stringCount);
      expect(getLimitedCountDisplay).to.be.calledWithExactly(count);
      expect(select).to.be.calledWithExactly(Selectors.recordCount);
    });
  });
});
