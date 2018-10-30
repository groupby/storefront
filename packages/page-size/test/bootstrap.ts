import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/page-size/index.html',
  '../src/past-purchases-page-size/index.html',
]);
