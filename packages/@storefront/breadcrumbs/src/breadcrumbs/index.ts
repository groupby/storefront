import { configurable, provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@configurable
@provide<Breadcrumbs.Props, Breadcrumbs.State>(
  'breadcrumbs',
  ({ showLabels, labels }, { fields, originalQuery, correctedQuery }) => ({
    showLabels,
    labels,
    fields,
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
        navigationsSelector = () => this.select(Selectors.navigations);
        break;
    }
    this.state = { navigationsSelector, fields: this.getFields(navigationsSelector()), originalQuery: this.select(Selectors.query) };
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

  getFields(navigations: Store.Navigation[]) {
    return navigations
      .filter((navigation) => navigation.selected.length !== 0)
      .map((navigation) => navigation.field);
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
    correctedQuery?: string;
    navigationsSelector?: () => Store.Navigation[];
  }
}

export default Breadcrumbs;
