import { provide, tag, Events, Selectors, Store, Tag } from '@storefront/core';
import Sayt from '../sayt';

@provide('autocomplete')
@tag('gb-sayt-autocomplete', require('./index.html'))
class Autocomplete {
  state: Autocomplete.State = <any>{
    onHover: (event: MouseEvent) => {
      const updateQuery = !!this.config.autocomplete.hoverAutoFill;
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
    this.state = { ...this.state, suggestions, navigations, category, categoryValues, products, selected: -1 };
  }

  init() {
    this.services.autocomplete.registerAutocomplete(this);
    this.flux.on(Events.AUTOCOMPLETE_SUGGESTIONS_UPDATED, this.updateSuggestions);
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
  };

  activatePrevious = () => {
    const targets = this.activationTargets();
    if (this.isActive()) {
      let selected = this.state.selected;
      this.setActivation(targets, selected, false);
      this.setActivation(targets, --selected, true);
    }
  };

  selectActive = () => {
    if (this.isActive()) {
      const targets = this.activationTargets();

      targets[this.state.selected].querySelector('a').click();
      this.set({ selected: -1 });
    }
  };

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
    } else {
      this.flux.emit('sayt:show');
    }
  };

  setActivation(targets: NodeListOf<HTMLElement>, index: number, activate: boolean, updateQuery: boolean = true) {
    const target = targets[index];
    const indexExists = index !== -1;
    if (indexExists) {
      target.classList[activate ? 'add' : 'remove']('gb-active');
    }
    if (activate) {
      this.state.selected = index;
      if (indexExists) {
        this.updateProducts(target, updateQuery);
      }
    }
  }

  updateProducts(
    { dataset: { query: selectedQuery, refinement, field, pastPurchase } }: HTMLElement,
    updateQuery: boolean = true
  ) {
    const query = selectedQuery == null ? this.select(Selectors.autocompleteQuery) : selectedQuery;
    if (updateQuery) {
      this.flux.emit('query:update', query);
    }
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
    products: Store.ProductWithMetadata[];
    onHover(event: MouseEvent): void;
  }
}

export default Autocomplete;
