import { Navigation, ValueRefinement } from 'groupby-api';
import Configuration from '../configuration';
import Selectors from '../selectors';
import Store from '../store';
import { sortBasedOn } from '../utils';
import ConfigurationAdapter from './configuration';

namespace Recommendations {

  export const buildUrl = (customerId: string, endpoint: string, mode: string) =>
    `https://${customerId}.groupbycloud.com/wisdom/v2/public/recommendations/${endpoint}/_get${mode}`;

  export const sortNavigations = ({ results, navigations }: Navigations): Navigation[] =>
    sortBasedOn(results, navigations, (unsorted, sorted) => unsorted.name === sorted.name);

  export const sortRefinements = ({ results, navigations, config }: Navigations): Navigation[] => {
    const refinementSort = config && ConfigurationAdapter.extractRefinementsSort(config);
    return (Array.isArray(refinementSort) ?
      navigations.filter(({ name }) => refinementSort.find((nav) => nav === name)) : navigations)
      .reduce((resultsAcc, navigation) => {
        const index = resultsAcc.findIndex(({ name }) => navigation.name === name);
        if (index !== -1) {
          resultsAcc = [...resultsAcc.slice(0, index), {
            ...resultsAcc[index], refinements:
              sortBasedOn(resultsAcc[index].refinements, navigation.values,
                (unsorted: ValueRefinement, sorted) => unsorted.value.toLowerCase() === sorted.value.toLowerCase())
          }, ...resultsAcc.slice(index + 1)];
        }
        return resultsAcc;
      }, results);
  };

  export const pinNavigations = ({ results, config }: Navigations): Navigation[] => {
    const pinnedArray = ConfigurationAdapter.extractNavigationsPinned(config);
    return sortBasedOn(results, pinnedArray, (unsorted, pinnedName) => unsorted.name === pinnedName);
  };

  export const pinRefinements = ({ results, config }: Navigations): Navigation[] => {
    const pinnedRefinements = ConfigurationAdapter.extractRefinementsPinned(config);
    const pinnedRefinementsNavigationsArray: Store.Recommendations.Navigation[] =
      Object.keys(pinnedRefinements).map((key) => ({
        name: key,
        values: pinnedRefinements[key].map((value) => ({ value, count: -1 }))
      }));
    return sortRefinements({ results, navigations: pinnedRefinementsNavigationsArray });
  };

  // tslint:disable-next-line max-line-length
  export const sortAndPinNavigations = (availableNavigations: Navigation[], navigations: Store.Recommendations.Navigation[], config: Configuration): Navigation[] => {
    const iNav = ConfigurationAdapter.extractINav(config);
    const noTransform = ((x) => x.results);
    const transformations = [
      iNav.navigations.sort ? sortNavigations : noTransform,
      iNav.navigations.pinned ? pinNavigations : noTransform,
      iNav.refinements.sort ? sortRefinements : noTransform,
      iNav.refinements.pinned ? pinRefinements : noTransform
    ];
    return transformations.reduce((results, transform: Function) =>
      transform({ results, navigations, config }), availableNavigations);
  };

  // tslint:disable-next-line max-line-length
  export const addLocationToRequest = (request: RecommendationsRequest, state: Store.State): Request => {
    const locationConfig = ConfigurationAdapter.extractLocation(Selectors.config(state));
    const location = Selectors.location(state);
    if (locationConfig && location) {
      return {
        minSize: locationConfig.minSize,
        sequence: [
          {
            ...request,
            matchExact: {
              ...(request.matchExact || {}),
              and: [{
                visit: {
                  generated: {
                    geo: {
                      location: {
                        distance: locationConfig.distance,
                        center: {
                          lat: location.latitude,
                          lon: location.longitude
                        }
                      }
                    }
                  }
                }
              }]
            }
          },
          request,
        ]
      };
    } else {
      return request;
    }
  };

  export type Request = RecommendationsBody | RecommendationsRequest;

  export interface RecommendationsRequest {
    size?: number;
    window?: string;
    matchPartial?: object;
    matchExact?: object;
    type?: string;
    target?: string;
  }

  export interface RecommendationsBody {
    minSize: number;
    sequence: RecommendationsRequest[];
  }

  export interface PastPurchaseRequest {
    query?: string;
    securedPayload: Configuration.Recommendations.SecuredPayload;
  }

  export interface Navigations {
    results: Navigation[];
    navigations?: Store.Recommendations.Navigation[];
    config?: Configuration;
  }
}

export default Recommendations;
