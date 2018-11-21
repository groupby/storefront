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
      const name = 'default';
      const zones = {};
      const set = (template.set = spy());
      template.state = <any>{ name: undefined };
      template.props = { target: name };

      template.updateZones(<any>{ name, zones });

      expect(set).to.be.calledWith({ name, zones, isActive: true, rule: undefined });
    });

    it('should update the active state based on the template name', () => {
      const name = 'templateB';
      const rule = 'Rule A';
      const zones = { a: 'b' };
      const set = (template.set = spy());
      template.props = { target: name };
      template.state = <any>{ name: 'templateA', rule };

      template.updateZones(<any>{ name, rule, zones });

      expect(set).to.be.calledWith({ name, rule, zones, isActive: true });
    });

    it('should update the active state based on the rule name', () => {
      const name = 'templateA';
      const rule = 'Rule B';
      const zones = { a: 'b' };
      const set = (template.set = spy());
      template.props = { target: name };
      template.state = <any>{ name, rule: 'Rule A' };

      template.updateZones(<any>{ name, rule, zones });

      expect(set).to.be.calledWith({ name, rule, zones, isActive: true });
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
      const name = 'top-rated';
      const rule = 'Top Rated Rule';
      template.set = () => expect.fail();
      template.state = <any>{ name, rule };

      template.updateZones(<any>{ name, rule });
    });
  });
});
