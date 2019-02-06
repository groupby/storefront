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
    let get;

    beforeEach(() => {
      get = stub(Cookies, 'get');
    });

    it('should pass through to Cookies.get()', () => {
      const key = 'foo';

      service.get(key);

      expect(get).to.be.calledWithExactly(key);
    });
  });

  describe('set()', () => {
    let set;

    beforeEach(() => {
      set = stub(Cookies, 'set');
    });

    it('should pass through to Cookies.set()', () => {
      const key = 'foo';
      const value = { bar: 'baz' };
      const options = { quux: 'Hello, world!' };

      service.set(key, value, options);

      expect(set).to.be.calledWithExactly(key, value, options);
    });
  });

  describe('remove()', () => {
    let remove;

    beforeEach(() => {
      remove = stub(Cookies, 'remove');
    });

    it('should pass through to Cookies.remove()', () => {
      const key = 'foo';
      const options = { bar: 'baz' };

      service.remove(key, options);

      expect(remove).to.be.calledWithExactly(key, options);
    });
  });
});
