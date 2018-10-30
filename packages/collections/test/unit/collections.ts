import { Events, Selectors } from '@storefront/core';
import Collections from '../../src/collections';
import suite from './_suite';

suite('Collections', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let collections: Collections;

  beforeEach(() => collections = new Collections());

  itShouldBeConfigurable(Collections);
  itShouldProvideAlias(Collections, 'collections');

  describe('constructor()', () => {
    describe('props', () => {
      it('should have initial value', () => {
        expect(collections.props).to.eql({ labels: {}, limitCount: false });
      });
    });

    describe('state', () => {
      it('should have initial value', () => {
        expect(collections.state.collections).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.selectCollection()', () => {
          const collection = 'products';
          const selectCollection = spy();
          collections.state.collections = <any[]>[{ value: 'other' }, { value: collection }];
          collections.actions = <any>{ selectCollection };

          collections.state.onSelect(1);

          expect(selectCollection).to.be.calledWith(collection);
        });
      });
    });
  });

  describe('init()', () => {
    it('should call updateCollections()', () => {
      const updateCollections = collections.updateCollections = spy();
      collections.subscribe = () => null ;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(updateCollections).to.be.called;
    });

    it('should register for COLLECTION_UPDATED event', () => {
      const subscribe = collections.subscribe = spy();
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(subscribe).to.be.calledWith(Events.COLLECTION_UPDATED, collections.updateCollectionTotal);
    });

    it('should register for SELECTED_COLLECTION_UPDATED event', () => {
      const subscribe = collections.subscribe = spy();
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(subscribe).to.be.calledWith(Events.SELECTED_COLLECTION_UPDATED, collections.updateCollections);
    });

    it('should register with collections service', () => {
      const register = spy();
      collections.subscribe = () => null;
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register } };

      collections.init();

      expect(register).to.be.calledWith(collections);
    });
  });

  describe('updateCollections()', () => {
    it('should set collections', () => {
      const state = { a: 'b' };
      const newCollections = ['c', 'd'];
      const rawCollections = ['e', 'f'];
      const set = collections.set = spy();
      const selectCollections = collections.selectCollections = spy(() => newCollections);
      const select = collections.select = spy(() => rawCollections);
      collections.flux = <any>{ store: { getState: () => state } };

      collections.updateCollections();

      expect(selectCollections).to.be.calledWith(rawCollections);
      expect(select).to.be.calledWith(Selectors.collections);
      expect(set).to.be.calledWith({ collections: newCollections });
    });
  });

  describe('updateCollectionTotal()', () => {
    it('should update collection total', () => {
      const allIds = ['a', 'b', 'c'];
      const set = collections.set = spy();
      const state = { j: 'k' };
      const select = collections.select = spy(() => 1);
      collections.flux = <any>{ store: { getState: () => state } };
      collections.state = <any>{ collections: [{ d: 'e' }, { f: 'g' }, { h: 'i' }] };

      collections.updateCollectionTotal({ name: 'b', total: 50 });

      expect(select).to.be.calledWith(Selectors.collectionIndex);
      expect(set).to.be.calledWith({ collections: [{ d: 'e' }, { f: 'g', total: 50 }, { h: 'i' }] });
    });
  });

  describe('selectCollections()', () => {
    it('should map to options', () => {
      const collectionState: any = {
        allIds: ['a', 'b', 'c'],
        byId: { a: {}, b: { total: 4 }, c: {} },
        selected: 'b'
      };
      collections.props = <any>{ labels: {} };

      const options = collections.selectCollections(collectionState);

      expect(options).to.eql([
        { value: 'a', label: 'a', selected: false, total: undefined },
        { value: 'b', label: 'b', selected: true, total: 4 },
        { value: 'c', label: 'c', selected: false, total: undefined }
      ]);
    });

    it('should allow overriding labels', () => {
      const collectionState: any = {
        allIds: ['a', 'b', 'c'],
        byId: { a: {}, b: {}, c: {} },
        selected: 'b'
      };
      collections.props = <any>{ labels: { a: 'A', b: 'B', c: 'C' } };

      const options = collections.selectCollections(collectionState);

      expect(options).to.eql([
        { value: 'a', label: 'A', selected: false, total: undefined },
        { value: 'b', label: 'B', selected: true, total: undefined },
        { value: 'c', label: 'C', selected: false, total: undefined }
      ]);
    });
  });

  describe('getTotal()', () => {
    it('should return given total', () => {
      const total = 100000;
      collections.props.limitCount = false;

      expect(collections.getTotal(total)).to.eq(total);
    });

    it('should return limited total', () => {
      const total = 100000;
      const stringTotal = '10000+';
      const getLimitedCountDisplay = stub(Selectors, 'getLimitedCountDisplay').returns(stringTotal);
      collections.props.limitCount = true;

      const result = collections.getTotal(total);

      expect(result).to.eq(stringTotal);
      expect(getLimitedCountDisplay).to.be.calledWithExactly(total);
    });
  });
});
