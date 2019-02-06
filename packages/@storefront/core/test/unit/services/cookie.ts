import * as Cookies from 'js-cookie';
import Service from '../../../src/services/cookie';
import StoreFront from '../../../src/storefront';
import suite from './_suite';

suite('Cookie Service', ({ expect, spy, itShouldExtendBaseService, stub }) => {
  let app: StoreFront;
  let service: Service;
  let on: sinon.SinonSpy;

  beforeEach(() => {
    on = spy();
    app = <any>{ flux: { on } };
    service = new Service(app, {});
  });

  describe('constructor()', () => {
    itShouldExtendBaseService(() => service);
  });

  describe('init()', () => {
    it('should be a no-op', () => {
      expect(() => service.init()).to.not.throw();
    });
  });

  describe('get()', () => {
    it('should pass through to Cookies.get()', () => {
      const key = 'foo';
      const get = stub(Cookies, 'get');

      service.get(key);

      expect(get).to.be.calledWithExactly(key);
    });
  });

  describe('set()', () => {
    it('should pass through to Cookies.set()', () => {
      const key = 'foo';
      const value = { bar: 'baz' };
      const options = { quux: 'Hello, world!' };
      const set = stub(Cookies, 'set');

      service.set(key, value, options);

      expect(set).to.be.calledWithExactly(key, value, options);
    });
  });

  describe('remove()', () => {
    it('should pass through to Cookies.remove()', () => {
      const key = 'foo';
      const options = { bar: 'baz' };
      const remove = stub(Cookies, 'remove');

      service.remove(key, options);

      expect(remove).to.be.calledWithExactly(key, options);
    });
  });
});
