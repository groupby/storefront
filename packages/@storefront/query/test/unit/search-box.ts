import { Events, Selectors } from '@storefront/core';
import * as sinon from 'sinon';
import SearchBox from '../../src/search-box';
import suite from './_suite';

const QUERY = 'blue dress';

suite('SearchBox', ({ expect, spy, stub, itShouldConsumeAlias, itShouldProvideAlias }) => {
  let select: sinon.SinonSpy;
  let searchBox: SearchBox;

  beforeEach(() => {
    select = SearchBox.prototype.select = spy(() => QUERY);
    SearchBox.prototype.flux = <any>{};
    searchBox = new SearchBox();
  });
  afterEach(() => delete SearchBox.prototype.flux);

  itShouldConsumeAlias(SearchBox, 'query');
  itShouldProvideAlias(SearchBox, 'searchBox');

  describe('constructor()', () => {
    describe('state', () => {
      describe('originalQuery', () => {
        it('should set originalQuery from state', () => {
          expect(select).to.be.calledWith(Selectors.query);
          expect(searchBox.state.originalQuery).to.eq(QUERY);
        });
      });

      describe('onKeyDown()', () => {
        it('should call event.preventDefault() if keyCode is up or down', () => {
          const preventDefault = spy();

          searchBox.state.onKeyDown(<any>{ keyCode: 38, preventDefault });
          searchBox.state.onKeyDown(<any>{ keyCode: 40, preventDefault });

          expect(preventDefault).to.be.calledTwice;
        });

        it('should not call event.preventDefault() if keyCode is any other key', () => {
          const preventDefault = () => expect.fail();

          searchBox.state.onKeyDown(<any>{ keyCode: 13, preventDefault });
        });
      });

      describe('onKeyUp()', () => {
        it('should set preventUpdate', () => {
          const event: any = { keyCode: 10, target: {} };
          const updateAutocompleteQuery = spy();
          searchBox.flux = <any>{ emit: () => null };
          searchBox.actions = <any>{ updateAutocompleteQuery };

          searchBox.state.onKeyUp(event);

          expect(event.preventUpdate).to.be.true;
        });

        it('should call actions.search() if autocomplete is not active on ENTER pressed', () => {
          const value = 'hula hoop';
          const search = spy();
          searchBox.actions = <any>{ search };
          searchBox.services = <any>{ autocomplete: { hasActiveSuggestion: () => false } };

          searchBox.state.onKeyUp(<any>{ keyCode: 13, target: { value } });

          expect(search).to.be.calledWith(value);
        });

        it('should call emit sayt:select_active if autocomplete is active on ENTER pressed', () => {
          const emit = spy();
          searchBox.flux = <any>{ emit };
          searchBox.services = <any>{ autocomplete: { hasActiveSuggestion: () => true } };

          searchBox.state.onKeyUp(<any>{ keyCode: 13 });

          expect(emit).to.be.calledWith('sayt:select_active');
        });

        it('should emit sayt:hide on ESC pressed', () => {
          const emit = spy();
          searchBox.flux = <any>{ emit };

          searchBox.state.onKeyUp(<any>{ keyCode: 27 });

          expect(emit).to.be.calledWith('sayt:hide');
        });

        it('should call actions.autocomplete()', () => {
          const value = 'hula hoop';
          const updateAutocompleteQuery = spy();
          searchBox.flux = <any>{
            config: {
              autocomplete: {
                searchCharMinLimit: 1,
              },
            },
          };

          searchBox.actions = <any>{ updateAutocompleteQuery };

          searchBox.state.onKeyUp(<any>{ target: { value } });

          expect(updateAutocompleteQuery).to.be.calledWith(value);
        });

        it('should emit sayt:hide on blank query', () => {
          const emit = spy();
          const updateAutocompleteQuery = spy();
          searchBox.flux = <any>{ emit };
          searchBox.actions = <any>{ updateAutocompleteQuery };

          searchBox.state.onKeyUp(<any>{ target: {} });

          expect(emit).to.be.calledWith('sayt:hide');
          expect(updateAutocompleteQuery).to.be.calledWith('');
        });

        it('should emit sayt:activate_next on arrow down pressed', () => {
          const emit = spy();
          searchBox.flux = <any>{ emit };

          searchBox.state.onKeyUp(<any>{ keyCode: 40 });

          expect(emit).to.be.calledWith('sayt:activate_next');
        });

        it('should emit sayt:activate_previous on arrow up pressed', () => {
          const emit = spy();
          searchBox.flux = <any>{ emit };

          searchBox.state.onKeyUp(<any>{ keyCode: 38 });

          expect(emit).to.be.calledWith('sayt:activate_previous');
        });
      });

      describe('onClick()', () => {
        let event: any;
        let emit;

        beforeEach(() => {
          event = { target: {} };
          emit = spy();
          searchBox.flux = <any>{ emit };
        });

        it('should prevent update', () => {
          searchBox.state.onClick(event);

          expect(event.preventUpdate).to.be.true;
        });

        it('should emit sayt:show_recommendations when the search box is empty', () => {
          event.target.value = '';

          searchBox.state.onClick(event);

          expect(emit).to.be.calledWithExactly('sayt:show_recommendations');
        });

        it('should not emit sayt:show_recommendations when the search box is not empty', () => {
          event.target.value = 'hula hoop';

          searchBox.state.onClick(event);

          expect(emit).not.to.be.called;
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for ORIGINAL_QUERY_UPDATED, query:update, and set initial state', () => {
      const subscribe = (searchBox.subscribe = spy());

      searchBox.init();

      expect(subscribe).to.be.calledWith(Events.ORIGINAL_QUERY_UPDATED, searchBox.updateOriginalQuery);
      expect(subscribe).to.be.calledWith('query:update', searchBox.updateOriginalQuery);
    });
  });

  describe('onBeforeMount()', () => {
    it('should call $query.register()', () => {
      const register = spy();
      searchBox.$query = <any>{ register };

      searchBox.onBeforeMount();

      expect(register).to.be.calledWith(searchBox);
    });

    it('should not call $query.register() if no $query', () => {
      expect(() => searchBox.onBeforeMount()).to.not.throw();
    });

    it('should register with the autocomplete service if props.register is true', () => {
      const registerSearchBox = spy();
      searchBox.services = <any>{ autocomplete: { registerSearchBox } };
      searchBox.props.register = true;

      searchBox.onBeforeMount();

      expect(registerSearchBox).to.be.calledWith(searchBox);
    });

    it('should not register with the autocomplete service if props.register is false', () => {
      const registerSearchBox = spy();
      searchBox.services = <any>{ autocomplete: { registerSearchBox } };
      searchBox.props.register = false;

      searchBox.onBeforeMount();

      expect(registerSearchBox).not.to.be.called;
    });
  });

  describe('onMount()', () => {
    it('should call updateOriginalQuery with initial store state', () => {
      const updateOriginalQuery = (searchBox.updateOriginalQuery = spy());

      searchBox.onMount();

      expect(updateOriginalQuery).to.be.calledWith(QUERY);
    });
  });

  describe('updateOriginalQuery()', () => {
    it('should set originalQuery', () => {
      const originalQuery = 'orange soda';
      const set = (searchBox.set = spy());
      searchBox.state = <any>{ originalQuery: 'cherry soda' };

      searchBox.updateOriginalQuery(originalQuery);

      expect(set).to.be.calledWith({ originalQuery });
    });

    it('should not set originalQuery if value will not change', () => {
      searchBox.state = <any>{};
      searchBox.refs = <any>{ searchBox: { value: '' } };
      searchBox.set = () => expect.fail();

      searchBox.updateOriginalQuery(undefined);

      searchBox.refs = <any>{ searchBox: { value: 'cherry hardwood' } };

      searchBox.updateOriginalQuery('cherry hardwood');

      searchBox.state = <any>{ originalQuery: 'masonry' };

      searchBox.updateOriginalQuery('masonry');
    });
  });
});
