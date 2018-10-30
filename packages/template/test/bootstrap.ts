import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/products-zone/index.html',
  '../src/rich-content-zone/index.html',
  '../src/template/index.html',
]);
