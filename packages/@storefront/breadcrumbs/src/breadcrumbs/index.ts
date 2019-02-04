import { configurable, provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@configurable
@provide<Breadcrumbs.Props, Breadcrumbs.State>(
  'breadcrumbs',
  ({ showLabels, labels }, { fields, selectedNavigations, originalQuery, correctedQuery }) => ({
    showLabels,
    labels,
    fields,
    selectedNavigations,
    originalQuery,
    correctedQuery,
  })
)
@tag('gb-breadcrumbs', require('./index.html'))
class Breadcrumbs {
  props: Breadcrumbs.Props = {
    showLabels: true,
    labels: {
      results: 'Results:',
      noResults: 'No Results:',
      corrected: 'Corrected:',
    },
  };

  queryProps() {
    const { showLabels, labels } = this.props;
    const { originalQuery, correctedQuery } = this.state;
    return { showLabels, labels, originalQuery, correctedQuery };
  }

  init() {
    let navigationsSelector;
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.subscribe(Events.PAST_PURCHASE_SELECTED_REFINEMENTS_UPDATED, this.updateFields);
        navigationsSelector = () => this.select(Selectors.pastPurchaseNavigations);
        break;
      case StoreSections.SEARCH:
        this.subscribe(Events.ORIGINAL_QUERY_UPDATED, this.updateOriginalQuery);
        this.subscribe(Events.CORRECTED_QUERY_UPDATED, this.updateCorrectedQuery);
        this.subscribe(Events.NAVIGATIONS_UPDATED, this.updateFields);
        this.subscribe(Events.NAVIGATIONS_UPDATED, this.updateSelectedNavigations);
        navigationsSelector = () => this.select(Selectors.navigations);
        break;
    }

    // tslint:disable-next-line max-line-length
    this.state = { navigationsSelector, fields: this.getFields(navigationsSelector()), originalQuery: this.select(Selectors.query), selectedNavigations: this.getSelectedNavigations(navigationsSelector()) };
  }

  onBeforeMount() {
    // force update on before-mount, note that originalQuery is set in constructor
    const correctedQuery = this.select(Selectors.currentQuery);

    if (this.state.originalQuery !== correctedQuery) {
      this.updateCorrectedQuery(correctedQuery);
    }
  }

  updateOriginalQuery = (originalQuery: string) => this.set({ originalQuery });

  updateCorrectedQuery = (correctedQuery: string) => this.set({ correctedQuery });

  updateFields = () => this.set({ fields: this.getFields(this.state.navigationsSelector()) });

  // todo: Refactor the below in order to define this in the constructor or bind it within init().
  // tslint:disable-next-line max-line-length
  updateSelectedNavigations = () => this.set({ selectedNavigations: this.getSelectedNavigations(this.state.navigationsSelector()) });

  getFields(navigations: Store.Navigation[]) {
    return navigations
      .filter((navigation) => navigation.selected.length !== 0)
      .map((navigation) => navigation.field);
  }

  getSelectedNavigations(navigations: Store.Navigation[]) {
    return navigations
      .filter((navigation) => navigation.selected.length !== 0);
  }
}

interface Breadcrumbs extends Tag<Breadcrumbs.Props, Breadcrumbs.State> {}
namespace Breadcrumbs {
  export interface Props extends Tag.Props {
    showLabels?: boolean;
    labels?: {
      results?: string;
      noResults?: string;
      corrected?: string;
    };
  }

  export interface State {
    fields: string[];
    originalQuery: string;
    selectedNavigations: Store.Navigation[];
    correctedQuery?: string;
    navigationsSelector?: () => Store.Navigation[];
  }
}

export default Breadcrumbs;
