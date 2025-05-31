import React from 'react';
import { ProductVariant } from '../data/products';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ 
  variants, 
  selectedVariant, 
  onVariantChange 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Variant
      </label>
      <div className="grid grid-cols-1 gap-4">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onVariantChange(variant)}
            className={`flex justify-between items-center px-4 py-3 border rounded-lg transition-all ${
              selectedVariant.id === variant.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-3" 
                style={{ backgroundColor: variant.color.toLowerCase() }}
              />
              <span className="font-medium">{variant.name}</span>
            </div>
            <span className="font-semibold">${variant.price.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;