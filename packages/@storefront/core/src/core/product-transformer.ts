import { Store } from '@storefront/flux-capacitor';
import { Structure } from './types';
import { clone, dot } from './utils';

export const DEFAULT_VARIANT_FIELD = 'variants';
export const DEFAULT_TRANSFORM = (data) => ({});

// structure only picks from un-transformed product
// any keys the user adds will also be added by default
// otherwise there must be a structure mapping
// assume variant is of the same form as product, so use base structure as defaults
namespace ProductTransformer {

  export function transformer(structure: Structure) {
    return (product: object) => ProductTransformer.transform(product, structure);
  }

  export function transform(product: object, structure: Structure) {
    const { _variant: variantInfo, _transform = DEFAULT_TRANSFORM, ...baseStructure } = structure;
    const transformedProduct = { ...product, ...(_transform(clone(product, false)) || {}) };
    const effectiveStructure = Utils.extendStructure(product, transformedProduct, baseStructure);
    const data = Utils.remap(transformedProduct, effectiveStructure);

    if (variantInfo) {
      // tslint:disable-next-line max-line-length
      const variants = Utils.unpackVariants(variantInfo, transformedProduct, data, baseStructure)
        .map((variant) => Utils.combineData(data, variant));

      return { data: variants[0], variants };
    } else {
      return { data, variants: [data] };
    }
  }
}

export default ProductTransformer;

namespace Utils {
  // tslint:disable-next-line max-line-length
  export function unpackVariants({ field = DEFAULT_VARIANT_FIELD, structure = {} }: Partial<Structure.Variant>, product: object, remappedProduct: object, baseStructure: Structure.Base) {
    const variants: any[] = dot.get(product, field);

    if (variants) {
      const { _transform: transform = DEFAULT_TRANSFORM, ...variantStructure } = { ...baseStructure, ...structure };

      return variants
        .map((variant, index) => ({ ...variant, ...(transform(variant, index, product) || {}) }))
        .map(Utils.remapVariant(remappedProduct, variants, variantStructure));
    } else {
      return [{}];
    }
  }

  export function combineData(data: object, variant: object) {
    const newData = {...data};

    // overwrite only if not undefined
    Object.keys(variant).forEach((key) => {
      const value = variant[key];
      if (value !== undefined) {
        newData[key] = value;
      }
    });

    return newData;
  }

  export function extendStructure(originalData: object, transformedData: object, structure: Structure.Base) {
    const newKeys = Object.keys(transformedData).filter((key) => !(key in originalData));
    return newKeys.reduce((struct, key) => Object.assign(struct, { [key]: key }), { ...structure });
  }

  export function remap(product: object, structure: Partial<Structure>, defaults: object = {}) {
    return Object.keys(structure)
      .filter((key) => typeof structure[key] === 'string')
      .reduce((data, key) => Object.assign(data, {
        [key]: dot.get(product, structure[key], defaults[structure[key]])
      }), {});
  }

  export function remapVariant(baseProduct: object, variants: object[], structure: Structure.Base) {
    return (transformed, index) => {
      const effectiveStructure = Utils.extendStructure(variants[index], transformed, structure);
      return Utils.remap(transformed, effectiveStructure, baseProduct);
    };
  }
}

export { Utils as TransformUtils };
