import { Selectors } from '@storefront/flux-capacitor';
import * as sinon from 'sinon';
import Tag from '../../../../src/core/tag';
import * as decorators from '../../../../src/core/tag/decorators';
import utils from '../../../../src/core/tag/utils';
import StoreFront from '../../../../src/storefront';
import suite from '../../_suite';

suite('decorators', ({ expect, spy, stub }) => {
  describe('@tag', () => {
    it('should set tag description name and template', () => {
      const name = 'some-tag';
      const template = '<div></div>';
      const tag: any = { a: 'b' };
      const getDescription = stub(Tag, 'getDescription').returns({ metadata: {} });
      const setDescription = stub(Tag, 'setDescription');
      stub(StoreFront, 'register');

      decorators.tag(name, template)(tag);

      expect(getDescription).to.be.calledWithExactly(tag);
      expect(setDescription).to.be.calledWithExactly(tag, { metadata: { name }, view: template });
    });

    it('should set tag description css', () => {
      const style = 'label { background-color: red; }';
      const setDescription = stub(Tag, 'setDescription');
      const tag: any = { a: 'b' };
      stub(Tag, 'getDescription').returns({ metadata: {} });
      stub(StoreFront, 'register');

      decorators.tag('', '', style)(tag);

      expect(setDescription).to.be.calledWithExactly(tag, { metadata: { name: '' }, view: '', css: style });
    });

    it('should register resulting tag', () => {
      const name = 'some-tag';
      const tag: any = { a: 'b' };
      const internalRegister = spy();
      const register = stub(StoreFront, 'register').callsFake((cb) => cb(internalRegister));
      stub(Tag, 'getDescription').returns({ metadata: {} });

      decorators.tag(name, '')(tag);

      expect(register.called).to.be.true;
      expect(internalRegister).to.be.calledWithExactly(tag, name);
    });

    it('should have default view controller', () => {
      const name = 'some-tag';
      const internalRegister = spy();
      stub(StoreFront, 'register').callsFake((cb) => cb(internalRegister));
      stub(Tag, 'getDescription').returns({ metadata: {} });

      decorators.tag(name, '')();

      expect(internalRegister).to.be.calledWithExactly(
        sinon.match((cb) => {
          return expect(new cb()).to.not.eq(new cb());
        }),
        name
      );
    });
  });

  describe('@view', () => {
    it('should register a tag with the default view controller', () => {
      const name = 'some-tag';
      const template = '<div></div>';
      const tag = stub(decorators, 'tag').returns(() => null);

      decorators.view(name, template);

      expect(tag).to.be.calledWithExactly(name, template, undefined);
    });

    it('should also accept css', () => {
      const name = 'some-tag';
      const template = '<div></div>';
      const css = 'font-weight: bold;';
      const tag = stub(decorators, 'tag').returns(() => null);

      decorators.view(name, template, css);

      expect(tag).to.be.calledWithExactly(name, template, css);
    });
  });

  describe('@css', () => {
    it('should set css', () => {
      const style = 'label { background-color: red; }';
      const tag: any = { a: 'b' };
      const getDescription = stub(Tag, 'getDescription').returns({});
      const setDescription = stub(Tag, 'setDescription');

      decorators.css(style)(tag);

      expect(getDescription).to.be.calledWithExactly(tag);
      expect(setDescription).to.be.calledWithExactly(tag, { css: style });
    });
  });

  describe('@provide', () => {
    it('should call setMetadata()', () => {
      const aliasName = 'myAlias';
      const tag: any = { a: 'b' };
      const setMetadata = stub(utils, 'setMetadata');

      decorators.provide(aliasName)(tag);

      expect(setMetadata).to.be.calledWithExactly(tag, 'provides', { [aliasName]: sinon.match.func });
    });
  });

  describe('@origin', () => {
    it('should call setMetadata()', () => {
      const origin = 'moreRefinements';
      const tag: any = { a: 'b' };
      const setMetadata = stub(utils, 'setMetadata');

      decorators.origin(origin)(tag);

      expect(setMetadata).to.be.calledWithExactly(tag, 'origin', origin);
    });
  });

  describe('@configurable', () => {
    it('should set configurable on tag', () => {
      const tag: any = { a: 'b' };
      const setMetadata = stub(utils, 'setMetadata');

      decorators.configurable(tag);

      expect(setMetadata).to.be.calledWithExactly(tag, 'configurable', true);
    });
  });

  describe('@uiState', () => {
    const prop = 'ui';

    it('should replace tag state with ui state onBeforeMount', () => {
      const uiProp = 'uiProp';
      const storedState = { c: 'd' };
      const uiTagState = () => null;
      const name = 'tagName';
      const select = stub().withArgs(uiTagState, name, uiProp).returns(storedState);
      const state = { a: 'b' };
      const tag: any = class {
        props: any = { [prop]: uiProp };
        state: any = state;
        select: any = select;
      };
      stub(Tag, 'getMeta').returns({ name });
      stub(Selectors, 'uiTagState').returns(uiTagState);

      decorators.uiState(prop)(tag);
      const result = new tag();
      result.onBeforeMount();

      expect(result.state).to.eql({ ...state, ...storedState });
    });

    it('should call the original onBeforeMount method', () => {
      const uiProp = 'uiProp';
      const storedState = { c: 'd' };
      const uiTagState = () => null;
      const name = 'tagName';
      const select = stub().withArgs(uiTagState, name, uiProp).returns(storedState);
      const state = { a: 'b' };
      const tag: any = class {
        props: any = { [prop]: uiProp };
        state: any = state;
        select: any = select;
        onBeforeMount = () => this.state = state;
      };
      stub(Tag, 'getMeta').returns({ name });
      stub(Selectors, 'uiTagState').returns(uiTagState);

      decorators.uiState(prop)(tag);
      const result = new tag();
      result.onBeforeMount();

      expect(result.state).to.eq(state);
    });

    it('should set up ui state onBeforeUnmount, using resolver', () => {
      const uiProp = 'uiProp';
      const props = { [prop]: uiProp };
      const state = { a: 'b' };
      const createComponentState = spy();
      const tag: any = class {
        props: any = props;
        state: any = state;
        actions: any = { createComponentState };
      };
      const uiState = { c: 'd' };
      const resolver = stub().withArgs(props, state).returns(uiState);
      const name = 'tagName';
      stub(Tag, 'getMeta').returns({ name });

      decorators.uiState(prop, resolver)(tag);
      const result = new tag();
      result.onBeforeUnmount();

      expect(createComponentState).to.be.calledWith(name, uiProp, uiState);
    });

    it('should use default prop and resolver if none is provided', () => {
      const uiProp = 'uiProp';
      const storedState = { c: 'd' };
      const uiTagState = () => null;
      const name = 'tagName';
      const select = stub().withArgs(uiTagState, name, uiProp).returns(storedState);
      const state = { a: 'b' };
      const createComponentState = spy();
      const tag: any = class {
        props: any = { uiValue: uiProp };
        state: any = state;
        select: any = select;
        actions: any = { createComponentState };
      };
      stub(Tag, 'getMeta').returns({ name });
      stub(Selectors, 'uiTagState').returns(uiTagState);

      decorators.uiState()(tag);
      const result = new tag();

      result.onBeforeMount();
      expect(result.state).to.eql({ ...state, ...storedState });
      result.onBeforeUnmount();
      expect(createComponentState).to.be.calledWith(name, uiProp, { ...state, ...storedState });
    });
  });
});
