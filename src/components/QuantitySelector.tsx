import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  onQuantityChange
}) => {
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quantity
      </label>
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="p-2 rounded-l-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <input
          type="text"
          value={quantity}
          onChange={handleInputChange}
          className="w-16 border-t border-b border-gray-300 py-2 text-center text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
          className="p-2 rounded-r-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
        
        <span className="ml-3 text-sm text-gray-500">
          {maxQuantity} available
        </span>
      </div>
    </div>
  );
};

export default QuantitySelector;