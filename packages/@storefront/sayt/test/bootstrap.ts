import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/sayt/index.html',
  '../src/autocomplete/index.html',
  '../src/categories/index.html',
  '../src/navigations/index.html',
  '../src/past-purchases/index.html',
  '../src/past-purchase/index.html',
  '../src/products/index.html',
  '../src/refinements/index.html',
  '../src/search-terms/index.html',
]);
