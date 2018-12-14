import { RefinementResults } from 'groupby-api';
import Selectors from '../selectors';
import Store from '../store';
import Search from './search';

namespace RefinementsAdapter {

  // tslint:disable-next-line max-line-length
  export const mergeRefinements = ({ navigation: { name: navigationId, refinements: original } }: RefinementResults, state: Store.State) => {
    const { refinements, selected } = RefinementsAdapter
        .extractRefinements(Selectors.navigation(state, navigationId), original);

    return { navigationId, refinements, selected };
  };

  // tslint:disable-next-line max-line-length
  export const mergePastPurchaseRefinements = ({ navigation: { name: navigationId, refinements: original } }: RefinementResults, state: Store.State) => {
    const { refinements, selected } = RefinementsAdapter
        .extractRefinements(Selectors.pastPurchaseNavigation(state, navigationId), original);

    return { navigationId, refinements, selected };
  };

  export const extractRefinements = (navigation, original) => {
    const navigationType = navigation.range ? 'Range' : 'Value';
    const selectedRefinements = navigation.refinements
      .filter((_, index) => navigation.selected.includes(index));
    const refinements = original.map(Search.extractRefinement);
    const selected = refinements.reduce((refs, refinement, index) => {
      // tslint:disable-next-line max-line-length
      const found = selectedRefinements.findIndex((ref: any) => Search.refinementsMatch(refinement, ref, navigationType));
      if (found !== -1) {
        refs.push(index);
      }
      return refs;
    }, []);

    return { refinements, selected };
  };
}

export default RefinementsAdapter;
