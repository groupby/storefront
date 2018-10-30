import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/collections/index.html',
  '../src/option/index.html',
]);
