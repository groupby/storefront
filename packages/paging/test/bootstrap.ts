import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, ['../src/pager/index.html',
  '../src/pages/index.html',
  '../src/paging/index.html',
  '../src/terminal-pager/index.html',
]);
