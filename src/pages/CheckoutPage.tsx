import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedVariant, quantity, subtotal, total } = useCart();
  
  // Update the page title when the component mounts
  useEffect(() => {
    document.title = 'ShopSimple - Checkout';
  }, []);
  
  // Redirect to home if no product is selected
  useEffect(() => {
    if (!selectedVariant) {
      navigate('/');
    }
  }, [selectedVariant, navigate]);
  
  if (!selectedVariant) {
    return null;
  }
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">
          Please enter your information to complete your purchase.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        
        <div>
          <OrderSummary 
            variant={selectedVariant}
            quantity={quantity}
            subtotal={subtotal}
            total={total}
          />
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Transaction Simulation Note
            </h3>
            <p className="text-xs text-gray-600">
              For this demo, we simulate three possible transaction outcomes:
            </p>
            <ul className="mt-2 text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Approved (70% chance)</li>
              <li>Declined (20% chance)</li>
              <li>Error (10% chance)</li>
            </ul>
            <p className="mt-2 text-xs text-gray-600">
              The outcome is randomly determined when you submit the form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;