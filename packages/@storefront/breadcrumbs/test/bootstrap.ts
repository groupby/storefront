import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/breadcrumbs/index.html',
  '../src/clear-all-refinements/index.html',
  '../src/clear-query/index.html',
  '../src/clear-refinement/index.html',
  '../src/corrected-query/index.html',
  '../src/original-query/index.html',
  '../src/query-crumb/index.html',
  '../src/refinement-crumb/index.html',
  '../src/refinement-crumbs/index.html',
]);
