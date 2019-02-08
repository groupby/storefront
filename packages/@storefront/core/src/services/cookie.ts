import * as Cookies from 'js-cookie';
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

  /**
   * Get the value of a cookie, or get all cookies.
   *
   * @param key The name of the cookie to get. If omitted, all cookies will be returned.
   * @return The value of the cookie given by `key`, or an object with all the cookie values keyed by their names.
   */
  get(key?: string): string | undefined | {[key: string]: string} {
    return Cookies.get(key);
  }

  /**
   * Set the value of a cookie.
   *
   * @param key The name of the cookie to set.
   * @param value The value of the cookie to set. Objects and arrays will be encoded as JSON before being stored.
   * @param options The attributes of the cookie.
   */
  set(key: string, value: any, options?: Cookies.CookieAttributes) {
    return Cookies.set(key, value, options);
  }

  /**
   * Delete the cookie with the given name.
   *
   * @param key The name of the cookie to delete.
   * @param options The attributes of the cookie.
   */
  remove(key: string, options?: Cookies.CookieAttributes) {
    return Cookies.remove(key, options);
  }
}

namespace CookieService {
  export interface Options {}
}

export default CookieService;
