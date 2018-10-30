import { tag, Tag } from '@storefront/core';

@tag('gb-query-crumb', require('./index.html'))
class QueryCrumb {
  correctedQueryLabel() {
    const { showLabels, correctedQuery, labels } = this.props;
    return showLabels && correctedQuery && labels.corrected;
  }

  originalQueryLabel() {
    const { showLabels, originalQuery, correctedQuery, labels } = this.props;
    return showLabels && originalQuery && labels[correctedQuery ? 'noResults' : 'results'];
  }
}

interface QueryCrumb extends Tag<QueryCrumb.Props> {}

namespace QueryCrumb {
  export interface Props {
    originalQuery: string;
    showLabels?: boolean;
    correctedQuery?: string;
    labels?: {
      results?: string;
      noResults?: string;
      corrected?: string;
    };
  }
}

export default QueryCrumb;
