import React from 'react';
import { ProductVariant } from '../data/products';

interface OrderSummaryProps {
  variant: ProductVariant;
  quantity: number;
  subtotal: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  variant,
  quantity,
  subtotal,
  total
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-start mb-4">
          <img 
            src={variant.image} 
            alt={variant.name} 
            className="w-16 h-16 object-cover rounded"
          />
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">{variant.name}</h3>
            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
            <p className="text-sm font-medium text-gray-900">
              ${variant.price.toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-gray-900 font-medium">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Shipping</p>
          <p className="text-gray-900 font-medium">Free</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Tax</p>
          <p className="text-gray-900 font-medium">Included</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;