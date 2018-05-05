import { alias, configurable, tag, Events, Selectors, Tag } from '@storefront/core';

@configurable
@alias('breadcrumbs')
@tag('gb-breadcrumbs', require('./index.html'))
class Breadcrumbs {

  props: Breadcrumbs.Props = {
    showLabels: true,
    labels: {
      results: 'Results:',
      noResults: 'No Results:',
      corrected: 'Corrected:'
    }
  };

  state: Breadcrumbs.State = {
    fields: [],
    originalQuery: this.select(Selectors.query)
  };

  init() {
    this.state = {
      ...this.state,
      labels: this.props.labels,
      showLabels: this.props.showLabels
    };

    // force update on init, note that originalQuery is set in constructor
    const correctedQuery = this.select(Selectors.currentQuery);

    if (this.state.originalQuery !== correctedQuery) {
      this.updateCorrectedQuery(correctedQuery);
    }

    this.subscribe(Events.ORIGINAL_QUERY_UPDATED, this.updateOriginalQuery);
    this.subscribe(Events.CORRECTED_QUERY_UPDATED, this.updateCorrectedQuery);
    this.subscribe(Events.NAVIGATIONS_UPDATED, this.updateFields);
  }

  updateOriginalQuery = (originalQuery: string) =>
    this.set({ originalQuery })

  updateCorrectedQuery = (correctedQuery: string) =>
    this.set({ correctedQuery })

  updateFields = () => {
    const navigations = this.select(Selectors.navigations);
    this.set({
      fields: navigations.filter((navigation) => navigation.selected.length !== 0)
        .map((navigation) => navigation.field)
    });
  }
}

interface Breadcrumbs extends Tag<Breadcrumbs.Props, Breadcrumbs.State> { }
namespace Breadcrumbs {
  export interface Props extends Tag.Props {
    showLabels?: boolean;
    labels?: {
      results?: string;
      noResults?: string;
      corrected?: string;
    };
  }

  export interface State extends Props {
    fields: string[];
    originalQuery: string;
    correctedQuery?: string;
  }
}

export default Breadcrumbs;