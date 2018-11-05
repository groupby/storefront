import Adapter from '../../../../src/core/adapters/autocomplete';
import ConfigAdapter from '../../../../src/core/adapters/configuration';
import SearchAdapter from '../../../../src/core/adapters/search';
import suite from '../../_suite';

suite('Autocomplete Adapter', ({ expect, stub }) => {

  describe('extractSuggestions()', () => {
    const config: any = { autocomplete: { showCategoryValuesForFirstMatch: false } };

    it('should remap search term values', () => {
      const searchTerms = [{ value: 'a', additionalInfo: '' }, { value: 'b', additionalInfo: '', test: 'ignore me' }];
      const response = { result: { searchTerms } };

      const { suggestions } = Adapter.extractSuggestions(response, '', '', {}, config);

      expect(suggestions).to.eql([
        { value: 'a', additionalInfo: '', disabled: undefined },
        { value: 'b', additionalInfo: '', disabled: undefined }
      ]);
    });

    it('should not extract category values if query does not match', () => {
      const brand = { a: 'b' };
      const values = ['x', 'y'];
      const searchTerm = { value: 'a', additionalInfo: { brand } };
      const response = { result: { searchTerms: [searchTerm] } };
      stub(Adapter, 'termsMatch').returns(false);
      stub(Adapter, 'extractCategoryValues').callsFake(() => expect.fail());

      const { categoryValues } = Adapter.extractSuggestions(response, '', 'brand', {}, config);

      expect(categoryValues).to.eql([]);
    });

    it('should extract category values when query matches', () => {
      const brand = { a: 'b' };
      const searchTerm = { value: 'app', additionalInfo: { brand } };
      const response = { result: { searchTerms: [searchTerm] } };
      const extractCategoryValues = stub(Adapter, 'extractCategoryValues').returns(['x', 'y']);
      stub(Adapter, 'termsMatch').returns(true);

      const { categoryValues } = Adapter.extractSuggestions(response, '', 'brand', {}, config);

      expect(categoryValues).to.eql([{matchAll: true}, 'x', 'y']);
      expect(extractCategoryValues).to.be.calledWith(searchTerm);
    });

    it('should add navigation labels if provided', () => {
      const brandNavigation = { name: 'a', values: ['b', 'c'] };
      const categoryNavigation = { name: 'd', values: ['e', 'f'] };
      const response = { result: { navigations: [brandNavigation, categoryNavigation] } };
      const labels = { a: 'Brand' };

      const { navigations } = Adapter.extractSuggestions(response, '', 'brand', labels, config);

      expect(navigations).to.eql([
        { field: 'a', refinements: ['b', 'c'], label: 'Brand' },
        { field: 'd', refinements: ['e', 'f'], label: 'd' },
      ]);
    });

    it('should should ignore category if not specified', () => {
      const response = { result: { searchTerms: [{}] } };
      const extractCategoryValues = stub(Adapter, 'extractCategoryValues');

      Adapter.extractSuggestions(response, '', '', {}, config);

      expect(extractCategoryValues.called).to.be.false;
    });

    it('should should ignore category if no search terms', () => {
      const response = { result: { searchTerms: [] } };
      const extractCategoryValues = stub(Adapter, 'extractCategoryValues');

      Adapter.extractSuggestions(response, '', 'brand', {}, config);

      expect(extractCategoryValues.called).to.be.false;
    });

    it('should set first searchTerms element to disabled',() => {
      const searchTerms = [{ value: 'g' }, { value: 'r' },
                           { value: 'o' }, { value: 'u' },
                           { value: 'p' }, { value: 'b' },
                           { value: 'y' }];

      stub(Adapter, 'termsMatch').returns(true);
      stub(Adapter, 'extractCategoryValues');

      Adapter.extractSuggestions({ result: { searchTerms } }, '', 'brand', {}, config);

      expect(searchTerms).to.eql([{ value: 'g', disabled: true }, { value: 'r' },
                                  { value: 'o' }, { value: 'u' }, { value: 'p' },
                                  { value: 'b' }, { value: 'y' }]);
    });

    // it
  });

  describe('extractCategoryValues()', () => {
    it('should return an array of category values', () => {

      const values = Adapter.extractCategoryValues({ additionalInfo: { brand: ['a', 'b'] } }, 'brand');

      expect(values).to.eql([{ value: 'a' }, { value: 'b' }]);
    });

    it('should default to empty array', () => {
      const values = Adapter.extractCategoryValues({ additionalInfo: {} }, 'brand');

      expect(values).to.eql([]);
    });

    it('should have additionalInfo default to empty object', () => {
      const values = Adapter.extractCategoryValues(<any>{ }, 'brand');

      expect(values).to.eql([]);
    });
  });

  describe('extractArea()', () => {
    const area = 'myArea';

    it('should call extractAutocompleteArea()', () => {
      const config: any = { a: 'b' };
      const extractAutocompleteArea = stub(ConfigAdapter, 'extractAutocompleteArea').returns(area);

      expect(Adapter.extractArea(config)).to.eq(area);

      expect(extractAutocompleteArea).to.be.calledWith(config);
    });

    it('should fall back to global area', () => {
      const config: any = { a: 'b' };
      const extractArea = stub(ConfigAdapter, 'extractArea').returns(area);
      stub(ConfigAdapter, 'extractAutocompleteArea');

      expect(Adapter.extractArea(config)).to.eq(area);

      expect(extractArea).to.be.calledWith(config);
    });
  });

  describe('extractProductArea()', () => {
    const area = 'myArea';

    it('should call extractAutocompleteProductArea()', () => {
      const config: any = { a: 'b' };
      const extractAutocompleteProductArea = stub(ConfigAdapter, 'extractAutocompleteProductArea')
        .returns(area);

      expect(Adapter.extractProductArea(config)).to.eq(area);

      expect(extractAutocompleteProductArea).to.be.calledWith(config);
    });

    it('should fall back to autocomplete area', () => {
      const config: any = { a: 'b' };
      const extractArea = stub(Adapter, 'extractArea').returns(area);
      stub(ConfigAdapter, 'extractAutocompleteProductArea');

      expect(Adapter.extractProductArea(config)).to.eq(area);

      expect(extractArea).to.be.calledWith(config);
    });
  });

  describe('extractLanguage()', () => {
    const language = 'en';

    it('should call extractAutocompleteLanguage()', () => {
      const config: any = { a: 'b' };
      const extractAutocompleteLanguage = stub(ConfigAdapter, 'extractAutocompleteLanguage').returns(language);

      expect(Adapter.extractLanguage(config)).to.eq(language);

      expect(extractAutocompleteLanguage).to.be.calledWith(config);
    });

    it('should fall back to global language', () => {
      const config: any = { a: 'b' };
      const extractLanguage = stub(ConfigAdapter, 'extractLanguage').returns(language);
      stub(ConfigAdapter, 'extractAutocompleteLanguage');

      expect(Adapter.extractLanguage(config)).to.eq(language);

      expect(extractLanguage).to.be.calledWith(config);
    });
  });

  describe('extractProductLanguage()', () => {
    const language = 'en';

    it('should call extractAutocompleteProductLanguage()', () => {
      const config: any = { a: 'b' };
      const extractAutocompleteProductLanguage = stub(ConfigAdapter, 'extractAutocompleteProductLanguage')
        .returns(language);

      expect(Adapter.extractProductLanguage(config)).to.eq(language);

      expect(extractAutocompleteProductLanguage).to.be.calledWith(config);
    });

    it('should fall back to autocomplete language', () => {
      const config: any = { a: 'b' };
      const extractLanguage = stub(Adapter, 'extractLanguage').returns(language);
      stub(ConfigAdapter, 'extractAutocompleteProductLanguage');

      expect(Adapter.extractProductLanguage(config)).to.eq(language);

      expect(extractLanguage).to.be.calledWith(config);
    });
  });

  describe('mergeSuggestions()', () => {
    it('should return an array of recommendations and suggestions', () => {
      const suggestions = [{ value: 'a' }, { value: 'b' }];
      const recommendations = <any>{ result: [{ query: 'test' }, { query: 'idk' }] };
      const result = [{ value: 'test', trending: true }, { value: 'idk', trending: true }, ...suggestions];
      expect(Adapter.mergeSuggestions(suggestions, recommendations)).to.eql(result);
    });
  });

  describe('termsMatch()', () => {
    it('should return true if both terms are roughly equivalent', () => {
      expect(Adapter.termsMatch('   ApPLe  ', ' aPPlE   ')).to.be.true;
    });

    it('should return false if terms are not equivalent', () => {
      expect(Adapter.termsMatch('   AppPlE  ', ' aPPlee   ')).to.be.false;
    });
  });
});
