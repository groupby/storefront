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
});
