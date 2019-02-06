import * as Cookies from 'js-cookie';
import { CookieAttributes } from 'js-cookie';
import { core, BaseService } from '../core/service';
import StoreFront from '../storefront';

@core
class CookieService extends BaseService<CookieService.Options> {
  constructor(app: StoreFront, opts: CookieService.Options) {
    super(app, opts);
  }

  init() {
    // no-op
  }

  get(key?: string) {
    return Cookies.get(key);
  }

  set(key: string, value: any, options?: CookieAttributes) {
    return Cookies.set(key, value, options);
  }
}

namespace CookieService {
  export interface Options {}
}

export default CookieService;
