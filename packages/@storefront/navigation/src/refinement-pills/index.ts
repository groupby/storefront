import * as Core from '@storefront/core';

@Core.provide('refinementPills')
@Core.tag('gb-refinement-pills', require('./index.html'))
class RefinementPills {
  state: RefinementPills.State = {
    navigations: [],
    queryNavigation: {},
    displayQuery: '',
    displayCount: 0,
  };

  init() {
    switch (this.props.storeSection) {
      case Core.StoreSections.PAST_PURCHASES:
        this.subscribeOnce(Core.Events.PAST_PURCHASE_NAVIGATIONS_UPDATED, this.updatePastPurchaseState);
        this.subscribe(Core.Events.PAST_PURCHASE_PRODUCTS_UPDATED, this.updatePastPurchaseState);
        this.updatePastPurchaseState();
        break;
    }
  }

  updatePastPurchaseState = () => {
    const navState = this.updatePastPurchaseDisplayQuery();
    const displayState = this.updatePastPurchaseNavigations();
    this.set({ ...navState, ...displayState });
  };

  updatePastPurchaseNavigations = () => {
    const navigations = this.select(Core.Selectors.pastPurchaseNavigations);

    const queryNavigation = this.buildPastPurchaseQueryNavigation();

    navigations.unshift(queryNavigation);

    return { navigations, queryNavigation };
  };

  updatePastPurchaseDisplayQuery = () => {
    const displayQuery = this.select(Core.Selectors.pastPurchaseQuery);
    return displayQuery
      ? { displayQuery, displayCount: this.select(Core.Selectors.pastPurchaseCurrentRecordCount) }
      : {};
  };

  buildPastPurchaseQueryNavigation = () => {
    const currentQuery = this.select(Core.Selectors.pastPurchaseQuery) || '';
    const displayQuery = this.state.displayQuery;
    const queriesAreEqual = displayQuery === currentQuery;
    const hasRefinementSelected = this.select(Core.Selectors.pastPurchaseSelectedRefinements).length !== 0;

    const resetQuery = () => this.actions.updatePastPurchaseQuery('');

    const refinements: any[] = [
      {
        value: 'All your purchases',
        total: this.select(Core.Selectors.pastPurchaseAllRecordCount),
        onClick: resetQuery,
      },
    ];

    if (displayQuery) {
      refinements.unshift({
        value: displayQuery,
        total: this.state.displayCount,
        onClick: () => this.actions.updatePastPurchaseQuery(displayQuery),
        onClose: () => {
          this.state.displayQuery = '';
          if (queriesAreEqual) {
            resetQuery();
          } else {
            this.updatePastPurchaseState();
          }
        },
      });
    }

    return {
      field: 'query',
      label: 'Query',
      selected: hasRefinementSelected ? [] : [displayQuery && !queriesAreEqual ? 1 : 0],
      refinements,
    };
  };
}

interface RefinementPills extends Core.Tag<{}, RefinementPills.State> {}
namespace RefinementPills {
  export interface State {
    navigations: Core.Store.Navigation[];
    queryNavigation: any;
    displayQuery: string;
    displayCount: number;
  }
}

export default RefinementPills;
