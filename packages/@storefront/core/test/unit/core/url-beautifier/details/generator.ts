import DetailsUrlGenerator from '../../../../../src/core/url-beautifier/details/generator';
import { UrlGenerator } from '../../../../../src/core/url-beautifier/handler';
import suite, { refinement } from '../../../_suite';

suite('DetailsUrlGenerator', ({ expect }) => {
  let generator: DetailsUrlGenerator;

  beforeEach(() => generator = new DetailsUrlGenerator(<any>{ config: { variantMapping: [] } }));

  it('should extend UrlGenerator', () => {
    expect(generator).to.be.an.instanceOf(UrlGenerator);
  });

  it('should convert a simple detail to a URL', () => {
    expect(generator.build({
      data: {
        title: 'red and delicious apples',
        id: '1923'
      },
      variants: []
    }))
      .to.eq('/red-and-delicious-apples/1923');
  });

  it('should encode special characters + in detail', () => {
    expect(generator.build({
      data: {
        title: 'red+and+delicious+apples',
        id: '1923'
      },
      variants: []
    }))
      .to.eq('/red%2Band%2Bdelicious%2Bapples/1923');
  });

  it('should encode special characters / in detail', () => {
    expect(generator.build({
      data: {
        title: 'red/and/delicious/apples',
        id: '1923'
      },
      variants: []
    }))
      .to.eq('/red%2Fand%2Fdelicious%2Fapples/1923');
  });

  it('should convert a detail with variants to a URL without reference keys', () => {
    generator.config.useReferenceKeys = false;
    const url = generator.build({
      data: {
        title: 'satin shiny party dress',
        id: '293014'
      },
      variants: [refinement('colour', 'red')]
    });

    expect(url).to.eq('/satin-shiny-party-dress/red/colour/293014');
  });

  it('should convert detail with variants to a URL and encode special characters without reference keys', () => {
    generator.config.useReferenceKeys = false;
    const url = generator.build({
      data: {
        title: 'satin shiny party dress',
        id: '293014'
      },
      variants: [refinement('colour', 'red+green/blue')]
    });

    expect(url).to.eq('/satin-shiny-party-dress/red%2Bgreen%2Fblue/colour/293014');
  });

  it('should convert a detail with a single refinement to a URL with a reference key', () => {
    generator.config.useReferenceKeys = true;
    generator.config.variantMapping = [{ c: 'colour' }];
    const url = generator.build({
      data: {
        title: 'dress',
        id: '293014'
      },
      variants: [refinement('colour', 'red')]
    });

    expect(url).to.eq('/dress/red/c/293014');
  });

  it('should convert a detail with multiple variants to a URL with reference keys', () => {
    generator.config.useReferenceKeys = true;
    generator.config.variantMapping = [{ c: 'colour' }, { b: 'brand' }];
    const url = generator.build({
      data: {
        title: 'dress',
        id: '293014'
      },
      variants: [refinement('colour', 'red'), refinement('brand', 'h&m')]
    });

    expect(url).to.eq('/dress/h%26m/red/bc/293014');
  });

  describe('error states', () => {
    it('should throw an error if no reference key found for refinement navigation name', () => {
      generator.config.useReferenceKeys = true;
      const build = () => generator.build({
        data: {
          title: 'dress',
          id: '293014'
        },
        variants: [refinement('colour', 'red')]
      });

      expect(build).to.throw("no mapping found for navigation 'colour'");
    });
  });
});
