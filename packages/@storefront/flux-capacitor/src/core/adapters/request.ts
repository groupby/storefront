import { SelectedRefinement, Sort } from 'groupby-api';
import { PAST_PURCHASE_SORTS } from '../utils';
import Store from '../store';
import { MAX_RECORDS } from './search';

namespace RequestAdapter {
  export const clampPageSize = (page: number, pageSize: number): number =>
    Math.min(pageSize, MAX_RECORDS - RequestAdapter.extractSkip(page, pageSize));

  export const extractSkip = (page: number, pageSize: number): number =>
    (page - 1) * pageSize;

  export const extractSort = ({ field, descending }: Store.Sort): Sort =>
    ({ field, order: descending ? 'Descending' : undefined });

  // tslint:disable-next-line max-line-length
  export const extractPastPurchaseSort = ({ field, descending }: Store.Sort, skus: Store.PastPurchases.PastPurchaseProduct[]): Sort =>
    Object.keys(PAST_PURCHASE_SORTS).map((k) => PAST_PURCHASE_SORTS[k]).includes(field)
      ? { type: 'ByIds', ids: skus.map(({ sku }) => sku) }
      : RequestAdapter.extractSort({ field, descending });

  export const extractRefinement = (field: string, refinement: Store.Refinement): SelectedRefinement =>
    (<Store.ValueRefinement>refinement).value
      ? { navigationName: field, type: 'Value', value: (<Store.ValueRefinement>refinement).value }
      // tslint:disable-next-line max-line-length
      : { navigationName: field, type: 'Range', high: (<Store.RangeRefinement>refinement).high, low: (<Store.RangeRefinement>refinement).low };
}

export default RequestAdapter;
