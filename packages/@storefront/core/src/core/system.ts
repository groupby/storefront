import FluxCapacitor from '@storefront/flux-capacitor';
import Globals from '../globals';
import { SystemServices } from '../services';
import StoreFront from '../storefront';
import Configuration from './configuration';
import Service from './service';
import Tag from './tag';
import { GlobalMixin } from './types';
import * as utils from './utils';

export default class System {
  constructor(public app: StoreFront) {}

  /**
   * start services, fire up the flux-capacitor, initialize riot
   */
  bootstrap(services: Service.Constructor.Map, config: Configuration) {
    config = this.initConfig(config);
    this.initRiot();
    this.initFlux();
    this.createServices(services);

    if (typeof config.bootstrap === 'function') {
      config.bootstrap(this.app);
    }

    this.initServices();
    this.initMixin();
    this.registerTags();
    this.initConfigMixins();
  }

  initConfig(config: Configuration) {
    return (this.app.config = Configuration.Transformer.transform(config));
  }

  initRiot() {
    const riot = (this.app.riot = this.app.config.options.riot || Globals.getRiot());
    Globals.set('riot', riot);
    const register = Tag.create(riot);
    this.app.register = (clazz, name) => {
      register(clazz);
      this.app.log.debug(`[tag/<${name}>] registered`);
    };
  }

  initFlux() {
    this.app.flux = new FluxCapacitor(this.app.config);
  }

  createServices(services: Service.Constructor.Map) {
    const servicesConfig = this.app.config.services || {};
    const allServices = { ...services, ...System.extractUserServices(servicesConfig) };
    this.app.services = System.buildServices(this.app, allServices, servicesConfig);
  }

  /**
   * initialize all core and user-defined services
   */
  initServices() {
    Object.keys(this.app.services).forEach((key) => {
      this.app.services[key].init(this.app.services);
      this.app.log.debug(`[service/${key}] initialized`);
    });
  }

  /**
   * initialize the core riot mixin
   */
  initMixin() {
    const { riot, config } = this.app;
    const mixin = Tag.mixin(this.app);

    if (config.options.globalMixin) {
      riot.mixin(mixin);
    } else {
      riot.mixin('storefront', mixin);
      riot.mixin('sf', mixin);
    }
  }

  /**
   * initialize the mixins supplied in the config
   */
  initConfigMixins() {
    const { riot, config: { mixins: { global: globalMixin, custom } } } = this.app;
    const processedGlobalMixin: GlobalMixin = { ...globalMixin };

    if (globalMixin.shouldUpdate === true) {
      delete processedGlobalMixin.shouldUpdate;
    } else if (globalMixin.shouldUpdate === false) {
      processedGlobalMixin.shouldUpdate = () => true;
    } // else shouldUpdate is a function and should be left alone

    riot.mixin(processedGlobalMixin);

    Object.keys(custom).forEach((mixin) => {
      riot.mixin(mixin, custom[mixin]);
    });
  }

  /**
   * register any tags that were registered before StoreFront started
   */
  registerTags() {
    Globals.getTags().forEach((registerTag) => registerTag(this.app.register));
  }

  static buildServices(app: StoreFront, services: Service.Constructor.Map, config: any) {
    return <SystemServices>Object.keys(services)
      .filter((key) => Service.isCore(services[key]) || config[key] !== false)
      .reduce((svcs, key) => {
        const serviceConfig = typeof config[key] === 'object' ? config[key] : {};
        return Object.assign(svcs, { [key]: new services[key](app, serviceConfig) });
      }, {});
  }

  static extractUserServices(services: { [key: string]: any }): Service.Constructor.Map {
    return Object.keys(services)
      .filter((key) => typeof services[key] === 'function')
      .reduce((svcs, key) => Object.assign(svcs, { [key]: services[key] }), {});
  }
}
