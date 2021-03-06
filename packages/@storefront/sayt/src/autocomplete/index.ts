import { provide, tag, utils, Events, Selectors, Store, Tag } from '@storefront/core';
import Sayt from '../sayt';

@provide('autocomplete')
@tag('gb-sayt-autocomplete', require('./index.html'))
class Autocomplete {
  state: Autocomplete.State = <any>{
    pastSearches: [],
    onHover: (event: MouseEvent) => {
      const updateQuery = !!this.select(Selectors.config).autocomplete.hoverAutoFill;
      const targets = this.activationTargets();
      const index = Array.from(targets).findIndex((element) => element === event.target);
      if (index === this.state.selected) {
        return;
      }
      if (this.isActive()) {
        this.setActivation(targets, this.state.selected, false, updateQuery);
      }
      this.setActivation(
        targets,
        Array.from(targets).findIndex((element) => element === event.target),
        true,
        updateQuery
      );
    },
  };

  constructor() {
    const suggestions = this.select(Selectors.autocompleteSuggestions);
    const products = this.select(Selectors.autocompleteProducts);
    const category = this.select(Selectors.autocompleteCategoryField);
    const categoryValues = this.select(Selectors.autocompleteCategoryValues);
    const navigations = this.select(Selectors.autocompleteNavigations);
    const pastSearches = this.services.search.getPastSearchTerms();
    this.state = {
      ...this.state,
      suggestions,
      navigations,
      category,
      categoryValues,
      pastSearches,
      products,
      selected: -1,
      isHovered: false,
    };
  }

  init() {
    const { debounceThreshold: delay } = this.select(Selectors.config).autocomplete;

    this.updateProducts = typeof delay === 'number' && delay >= 0
      ? utils.debounce(this.updateProducts, delay, this)
      : this.updateProducts.bind(this);

    this.services.autocomplete.registerAutocomplete(this);
    this.subscribe(Events.AUTOCOMPLETE_SUGGESTIONS_UPDATED, this.updateSuggestions);
    this.subscribe(Events.DONE_SEARCH, this.updatePastSearches);
    this.subscribe('sayt:activate_next', this.activateNext);
    this.subscribe('sayt:activate_previous', this.activatePrevious);
    this.subscribe('sayt:select_active', this.selectActive);
  }

  activationTargets(): NodeListOf<HTMLElement> {
    return <any>this.root.querySelectorAll('.gb-autocomplete-target');
  }

  activateNext = () => {
    const targets = this.activationTargets();
    let selected = this.state.selected;
    if (selected < targets.length - 1) {
      if (this.isActive()) {
        this.setActivation(targets, selected, false);
      }
      this.setActivation(targets, ++selected, true);
    }
  }

  activatePrevious = () => {
    const targets = this.activationTargets();
    if (this.isActive()) {
      let selected = this.state.selected;
      this.setActivation(targets, selected, false);
      this.setActivation(targets, --selected, true);
    }
  }

  selectActive = () => {
    if (this.isActive()) {
      const targets = this.activationTargets();

      targets[this.state.selected].querySelector('a').click();
      this.set({ selected: -1 });
    }
  }

  updatePastSearches = () =>
    this.set({ pastSearches: this.services.search.getPastSearchTerms() })

  updateSuggestions = ({
    suggestions,
    navigations,
    category: { values: categoryValues },
    products,
  }: Store.Autocomplete) => {
    if (this.isActive() && this.isMounted) {
      this.setActivation(this.activationTargets(), this.state.selected, false);
    }
    this.set({ suggestions, navigations, categoryValues, products, selected: -1 });
    if (suggestions.length + navigations.length + categoryValues.length + products.length === 0) {
      this.flux.emit('sayt:hide');
    } else if (!this.select(Selectors.isFetching, 'search')) {
      this.flux.emit('sayt:show');
    }
  }

  setActivation(targets: NodeListOf<HTMLElement>, index: number, activate: boolean, updateQuery: boolean = true) {
    const target = targets[index];
    const indexExists = index !== -1;
    if (indexExists) {
      target.classList[activate ? 'add' : 'remove']('gb-active');
    }
    if (activate) {
      this.state.selected = index;
      if (indexExists) {
        const data = this.parseTarget(target);
        if (updateQuery) {
          this.state.isHovered = false;
          this.updateQuery(data.query);
        } else {
          this.state.isHovered = true;
        }
        this.updateProducts(data);
      }
    }
  }

  parseTarget(
    { dataset: { query, refinement, field, pastPurchase } }: HTMLElement
  ): Autocomplete.TargetData {
    return { query, refinement, field, pastPurchase };
  }

  updateQuery(query: string = this.select(Selectors.autocompleteQuery)) {
    this.flux.emit('query:update', query);
  }

  updateProducts({
    query = this.select(Selectors.autocompleteQuery),
    refinement,
    field,
    pastPurchase
  }: Autocomplete.TargetData) {
    if (pastPurchase !== undefined) {
      this.flux.displaySaytPastPurchases();
    } else {
      this.flux.saytProducts(
        field ? null : query,
        refinement ? [{ field: field || this.state.category, value: refinement }] : []
      );
    }
  }

  isActive() {
    return this.state.selected !== -1;
  }

  isActiveAndHovered() {
    return this.isActive() && this.state.isHovered;
  }
}

interface Autocomplete extends Tag<Autocomplete.Props, Autocomplete.State> {}
namespace Autocomplete {
  export interface Props extends Sayt.Props {}

  export interface State {
    selected: number;
    category: string;
    categoryValues: string[];
    suggestions: Store.Autocomplete.Suggestion[];
    navigations: Store.Autocomplete.Navigation[];
    pastSearches: string[];
    products: Store.ProductWithMetadata[];
    isHovered: boolean;
    onHover(event: MouseEvent): void;
  }

   export interface TargetData {
     query: string;
     refinement: string;
     field: string;
     pastPurchase: string;
   }
}

export default Autocomplete;
