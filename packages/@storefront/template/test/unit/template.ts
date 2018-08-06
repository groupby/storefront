import { Events, Selectors } from '@storefront/core';
import Template from '../../src/template';
import suite from './_suite';

suite('Template', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let template: Template;

  beforeEach(() => (template = new Template()));

  itShouldBeConfigurable(Template);
  itShouldProvideAlias(Template, 'template');

  describe('constructor()', () => {
    describe('state', () => {
      it('should have initial value', () => {
        expect(template.state).to.eql({
          isActive: false,
          zones: {},
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for TEMPLATE_UPDATED if no $sayt alias and set initial state', () => {
      const subscribe = (template.subscribe = spy());
      const storeTemplate = { a: 'b' };
      const select = (template.select = stub());
      const updateZones = (template.updateZones = spy());
      select.withArgs(Selectors.template).returns(storeTemplate);

      template.init();

      expect(subscribe).to.be.calledOnce.and.calledWith(Events.TEMPLATE_UPDATED, template.updateZones);
      expect(updateZones).to.be.calledWithExactly(storeTemplate);
    });

    it('should listen for AUTOCOMPLETE_TEMPLATE_UPDATED if $sayt alias found', () => {
      const subscribe = (template.subscribe = spy());
      const storeTemplate = { c: 'd' };
      const select = (template.select = stub());
      const updateZones = (template.updateZones = spy());
      select.withArgs(Selectors.autocompleteTemplate).returns(storeTemplate);
      template.$sayt = true;

      template.init();

      expect(subscribe).to.be.calledOnce.and.calledWith(Events.AUTOCOMPLETE_TEMPLATE_UPDATED, template.updateZones);
      expect(updateZones).to.be.calledWithExactly(storeTemplate);
    });
  });

  describe('updateZones()', () => {
    it('should allow `default` to be targeted', () => {
      const target = 'default';
      const zones = {};
      const set = (template.set = spy());
      template.state = <any>{ name: undefined };
      template.props = { target };

      template.updateZones(<any>{ name: target, zones });

      expect(set).to.be.calledWith({ zones, name: target, rule: undefined, isActive: true });
    });

    it('should set active state', () => {
      const target = 'banner';
      const rule = 'toy banner';
      const zones = { a: 'b' };
      const set = (template.set = spy());
      template.props = { target };

      template.updateZones(<any>{ name: target, rule, zones });

      expect(set).to.be.calledWith({ zones, name: target, rule, isActive: true });
    });

    it('should set inactive state', () => {
      const name = 'banner';
      const set = (template.set = spy());
      template.state = <any>{ name: 'toy banner' };
      template.props = { target: 'default' };

      template.updateZones(<any>{ name });

      expect(set).to.be.calledWith({ zones: {}, name, rule: undefined, isActive: false });
    });

    it('should not call set()', () => {
      template.set = () => expect.fail();
      template.state = <any>{ name: 'top-rated' };
      template.props = { target: 'top-rated' };

      template.updateZones(<any>{ name: 'top-rated' });
    });
  });
});
