import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/button/index.html',
  '../src/custom-select/index.html',
  '../src/custom-select/index.css',
  '../src/filtered-list/index.html',
  '../src/icon/index.html',
  '../src/link/index.html',
  '../src/list/index.html',
  '../src/list/index.css',
  '../src/native-select/index.html',
  '../src/select/index.html',
  '../src/swatch/index.html',
  '../src/swatches/index.html',
  '../src/toggle/index.html',
  '../src/toggle/index.css',
  '../src/tooltip/index.html',
  '../src/tooltip/index.css',
]);
