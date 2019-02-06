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
});
