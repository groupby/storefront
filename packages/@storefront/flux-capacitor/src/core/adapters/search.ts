import {
  Navigation,
  PageInfo,
  RangeRefinement,
  Record,
  Refinement,
  Results,
  SelectedRangeRefinement,
  SelectedRefinement,
  SelectedValueRefinement,
  SortType,
  Template,
  ValueRefinement,
  Zone,
} from 'groupby-api';
import Actions from '../actions';
import Configuration from '../configuration';
import Selectors from '../selectors';
import Store from '../store';
import ConfigAdapter from './configuration';
import PageAdapter from './page';

export const MAX_RECORDS = 10000;

namespace SearchAdapter {

  // tslint:disable-next-line max-line-length
  export const extractQuery = ({ correctedQuery: corrected, didYouMean, originalQuery: original, relatedQueries: related, rewrites }: Results): Actions.Payload.Query =>
    ({ corrected, didYouMean, original, related, rewrites });

  export const extractRefinement = ({ type, value, low, high, count: total }: RangeRefinement & ValueRefinement):
    Store.ValueRefinement | Store.RangeRefinement =>
    type === 'Value' ? { value, total } : { low, high, total };

  export const extractNavigationSort = (sort: SortType): Store.Sort => {
    switch (sort) {
      case 'Count_Ascending': return { field: 'count' };
      case 'Count_Descending': return { field: 'count', descending: true };
      case 'Value_Ascending': return { field: 'value' };
      case 'Value_Descending': return { field: 'value', descending: true };
    }
  };

  export const extractNavigation = (navigation: Navigation): Store.Navigation => ({
    field: navigation.name,
    label: navigation.displayName,
    boolean: false,
    more: navigation.moreRefinements,
    or: navigation.or,
    range: !!navigation.range,
    max: navigation.max,
    min: navigation.min,
    refinements: navigation.refinements.map(SearchAdapter.extractRefinement),
    selected: [],
    sort: navigation.sort && SearchAdapter.extractNavigationSort(navigation.sort),
    metadata: navigation.metadata
      .reduce((metadata, keyValue) => Object.assign(metadata, { [keyValue.key]: keyValue.value }), {}),
  });

  // tslint:disable-next-line max-line-length
  export const refinementsMatch = (lhs: Store.Refinement, rhs: Refinement | SelectedRefinement, type: string = rhs.type) => {
    if (type === 'Value') {
      return (<Store.ValueRefinement>lhs).value === (<ValueRefinement | SelectedValueRefinement>rhs).value;
    } else {
      return (<Store.RangeRefinement>lhs).low === (<RangeRefinement | SelectedRangeRefinement>rhs).low
        && (<Store.RangeRefinement>lhs).high === (<RangeRefinement | SelectedRangeRefinement>rhs).high;
    }
  };

  export const mergeSelectedRefinements = (available: Store.Navigation, selected: Navigation) => {
    available.selected = [];

    selected.refinements.forEach((refinement: Refinement) => {
      const index = available.refinements.findIndex((availableRef) =>
        SearchAdapter.refinementsMatch(availableRef, refinement));

      if (index !== -1) {
        available.selected.push(index);
      } else {
        const { value, low, high, total } = <any>refinement;
        const newIndex = available.refinements.push(available.range
          ? { low, high, total }
          : { value, total }) - 1;
        available.selected.push(newIndex);
      }
    });
  };

  export const pruneRefinements = (navigations: Store.Navigation[], state: Store.State): Store.Navigation[] => {
    const config = Selectors.config(state);
    const max = ConfigAdapter.extractMaxRefinements(config);
    const booleanNavs = ConfigAdapter.extractToggleNavigations(config);
    return navigations.map((navigation) => {
      const bool = booleanNavs.includes(navigation.field);
      const mappedNavigation = {
        ...navigation,
        boolean: bool,
      };
      if (max) {
        const show = navigation.selected.slice(0, max);
        for (let i = 0; i < navigation.refinements.length && show.length < max; i++) {
          if (!navigation.selected.includes(i)) {
            show.push(i);
          }
        }

        mappedNavigation.more = navigation.refinements.length > max || navigation.more;
        mappedNavigation.show = show;
      }
      return mappedNavigation;
    });
  };

  export const filterExcludedRefinements = (refinements: Refinement[]): Refinement[] => {
    return refinements.filter((ref) => !ref.exclude);
  };

  export const filterNavigations = (navigations: Navigation[]): Navigation[] => {
    return navigations
      .map((navigation) => {
        const refinements = filterExcludedRefinements(navigation.refinements);
        return navigation = { ...navigation, refinements };
      })
      .filter((nav) => nav.refinements.length > 0 && !nav.ignored);
  };

  // tslint:disable-next-line max-line-length
  export const combineNavigations = ({ availableNavigation: available, selectedNavigation: selected }: Results): Store.Navigation[] => {
    let navigations = available.reduce((map, navigation) =>
      Object.assign(map, { [navigation.name]: SearchAdapter.extractNavigation(navigation) }), {});

    const filteredNavigations = filterNavigations(selected);

    filteredNavigations.forEach((selectedNav) => {
      const availableNav = navigations[selectedNav.name];

      if (availableNav) {
        SearchAdapter.mergeSelectedRefinements(availableNav, selectedNav);
      } else {
        const navigation = SearchAdapter.extractNavigation(selectedNav);
        navigation.selected = Object.keys(Array(navigation.refinements.length).fill(0))
          .map((value) => Number(value));
        navigations = { [selectedNav.name]: navigation, ...navigations };
      }
    });

    return Object.keys(navigations).reduce((navs, key) => navs.concat(navigations[key]), []);
  };

  export const extractZone = (zone: Zone): Store.Zone => {
    switch (zone.type) {
      case 'Content': return {
        content: zone.content,
        name: zone.name,
        type: Store.Zone.Type.CONTENT,
      };
      case 'Rich_Content': return {
        content: zone.richContent,
        name: zone.name,
        type: Store.Zone.Type.RICH_CONTENT,
      };
      case 'Record': return {
        name: zone.name,
        query: zone.query,
        products: zone.records.map((record) => extractAllMeta(record)),
        type: Store.Zone.Type.PRODUCTS,
      };
    }
  };

  export const extractTemplate = (template: Template = <any>{ zones: [] }): Store.Template => ({
    name: template.name,
    rule: template.ruleName,
    zones: Object.keys(template.zones).reduce((zones, key) =>
      Object.assign(zones, { [key]: SearchAdapter.extractZone(template.zones[key]) }), {}),
  });

  export const extractRecordCount = (recordCount: number) =>
    Math.min(recordCount, MAX_RECORDS);

  // tslint:disable-next-line max-line-length
  export const extractPage = (state: Store.State, totalRecords: number, current?: number, pageSize?: number): Actions.Payload.Page => {
    const currentPageSize = pageSize || Selectors.pageSize(state);
    const currentPage = current || Selectors.page(state);
    const last = PageAdapter.finalPage(currentPageSize, totalRecords);
    const from = PageAdapter.fromResult(currentPage, currentPageSize);
    const to = PageAdapter.toResult(currentPage, currentPageSize, totalRecords);

    return {
      from,
      last,
      next: PageAdapter.nextPage(currentPage, last),
      previous: PageAdapter.previousPage(currentPage),
      to,
      current: currentPage,
    };
  };

  export const extractData = (products: Store.ProductWithMetadata[]) =>
    products.map(({ data }) => data);

  export const extractAllMeta = (product: Store.Product | Record) =>
    (<Record>product).allMeta || product;

  export const augmentProducts = (results: Results) => {
    const startIndex = results.pageInfo.recordStart;
    return results.records.map(({ collection, allMeta }, index) =>
      ({
        meta: { collection },
        index: startIndex + index,
        data: allMeta,
      }));
  };
}

export default SearchAdapter;
