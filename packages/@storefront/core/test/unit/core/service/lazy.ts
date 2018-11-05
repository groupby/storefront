import { BaseService } from '../../../../src/core/service';
import Lazy from '../../../../src/core/service/lazy';
import suite from '../../_suite';

class LazyService extends Lazy {
  // tslint:disable-next-line no-empty
  lazyInit() { }
}

suite('LazyService', ({ expect, spy }) => {
  let lazyService: LazyService;

  beforeEach(() => lazyService = new LazyService(<any>{}, <any>{}));

  it('should extend BaseService', () => {
    expect(lazyService).to.be.an.instanceOf(BaseService);
  });

  describe('constructor()', () => {
    it('should set initial values', () => {
      expect(lazyService.registered).to.eql([]);
    });
  });

  describe('init()', () => {
    it('should be a no-op', () => {
      expect(() => lazyService.init()).to.not.throw();
    });
  });

  describe('register()', () => {
    it('should add to registered and initialize', () => {
      const tag: any = { a: ' b', one: () => null };
      const services = { c: 'd' };
      const lazyInit = lazyService.lazyInit = spy();
      lazyService['app'] = <any>{ services };

      lazyService.register(tag);

      expect(lazyService.registered).to.eql([tag]);
      expect(lazyInit).to.be.calledWith(services);
    });

    it('should skip initialize', () => {
      const tag: any = { a: ' b', one: () => null };
      const existingTag = { c: 'd' };
      lazyService.lazyInit = () => expect.fail();
      lazyService.registered = [existingTag];

      lazyService.register(tag);

      expect(lazyService.registered).to.eql([existingTag, tag]);
    });
  });
});
