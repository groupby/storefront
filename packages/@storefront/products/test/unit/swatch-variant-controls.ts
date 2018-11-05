import SwatchVariantControls from '../../src/swatch-variant-controls';
import suite from './_suite';

suite('SwatchVariantControls', ({ expect, spy, itShouldConsumeAlias }) => {
  let swatchControls: SwatchVariantControls;

  beforeEach(() => (swatchControls = new SwatchVariantControls()));

  itShouldConsumeAlias(SwatchVariantControls, 'product');

  describe('options()', () => {
    it('should return an array of variant values', () => {
      swatchControls.$product = <any>{ variants: [{ color: 'red' }, { color: 'blue' }] };
      swatchControls.props = <any>{ field: 'color' };

      expect(swatchControls.options()).to.eql(['red', 'blue']);
    });
  });

  describe('onClick()', () => {
    it('should call $product.onSelect() with persistence', () => {
      const index = 3;
      const onSelect = spy();
      swatchControls.$product = <any>{ onSelect };

      swatchControls.onClick(index);

      expect(onSelect).to.be.calledWithExactly(index, true);
    });

    it('should not call $product.onSelect() if nonexistent', () => {
      swatchControls.$product = <any>{};

      expect(() => swatchControls.onClick(2)).to.not.throw();
    });
  });

  describe('onSelect()', () => {
    it('should call $product.onSelect() with index when selecting', () => {
      const index = 7;
      const onSelect = spy();
      swatchControls.$product = <any>{ onSelect };

      swatchControls.onSelect(index, true);

      expect(onSelect).to.be.calledWithExactly(index);
    });

    it('should call $product.onSelect() with index -1 deselecting', () => {
      const onSelect = spy();
      swatchControls.$product = <any>{ onSelect };

      swatchControls.onSelect(7, false);

      expect(onSelect).to.be.calledWithExactly(-1);
    });

    it('should call not $product.onSelect() if nonexistent', () => {
      swatchControls.$product = <any>{};

      expect(() => swatchControls.onSelect(2, true)).to.not.throw();
    });
  });
});
