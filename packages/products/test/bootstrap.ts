import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/product/index.html',
  '../src/products/index.html',
  '../src/simple-card/index.html',
  '../src/swatch-variant-controls/index.html',
  '../src/tile/index.html'
]);
