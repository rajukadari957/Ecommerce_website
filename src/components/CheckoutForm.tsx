import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useCart } from '../context/CartContext';
import { useDatabase } from '../context/DatabaseContext';
import { CreditCard, Loader } from 'lucide-react';

// Define validation schemas
const customerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Zip code must be 5 digits')
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string().refine(
    (value) => {
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      return (
        monthNum >= 1 && 
        monthNum <= 12 && 
        (yearNum > currentYear || (yearNum === currentYear && monthNum >= currentMonth))
      );
    },
    {
      message: 'Expiry date must be a valid future date (MM/YY)'
    }
  ),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits')
});

type CustomerData = z.infer<typeof customerSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { selectedVariant, quantity, subtotal, total, clearCart } = useCart();
  const { createNewOrder } = useDatabase();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<'customer' | 'payment'>('customer');
  
  // Customer information state
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  // Payment information state
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Form errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle customer info form changes
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle payment info form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 16) {
        setPaymentData({
          ...paymentData,
          [name]: digitsOnly
        });
      }
    } 
    // Format expiry date as MM/YY
    else if (name === 'expiryDate') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 4) {
        let formatted = digitsOnly;
        if (digitsOnly.length > 2) {
          formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
        }
        setPaymentData({
          ...paymentData,
          [name]: formatted
        });
      }
    } 
    // Handle CVV
    else if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 3) {
        setPaymentData({
          ...paymentData,
          [name]: digitsOnly
        });
      }
    } 
    // Handle other fields
    else {
      setPaymentData({
        ...paymentData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate customer information
  const validateCustomerInfo = (): boolean => {
    try {
      customerSchema.parse(customerData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  // Validate payment information
  const validatePaymentInfo = (): boolean => {
    try {
      paymentSchema.parse(paymentData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  // Handle continue to payment step
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCustomerInfo()) {
      setFormStep('payment');
      setErrors({});
    }
  };
  
  // Handle back to customer info step
  const handleBackToCustomerInfo = () => {
    setFormStep('customer');
    setErrors({});
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentInfo()) {
      return;
    }
    
    if (!selectedVariant) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the order
      const order = await createNewOrder(
        customerData,
        paymentData,
        selectedVariant.id,
        quantity,
        subtotal,
        total
      );
      
      // Clear the cart
      clearCart();
      
      // Redirect to thank you page
      navigate(`/thank-you/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({
        submit: 'An error occurred while processing your order. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!selectedVariant) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">No product selected. Please go back to the product page.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {formStep === 'customer' ? (
        <form onSubmit={handleContinueToPayment}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={customerData.fullName}
                onChange={handleCustomerChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.fullName ? 'border-red-500' : ''
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerData.email}
                onChange={handleCustomerChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerData.phone}
                onChange={handleCustomerChange}
                placeholder="10 digits, numbers only"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={customerData.address}
                onChange={handleCustomerChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.address ? 'border-red-500' : ''
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={customerData.city}
                onChange={handleCustomerChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.city ? 'border-red-500' : ''
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={customerData.state}
                  onChange={handleCustomerChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.state ? 'border-red-500' : ''
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
              
              <div className="flex-1">
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={customerData.zipCode}
                  onChange={handleCustomerChange}
                  placeholder="5 digits"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.zipCode ? 'border-red-500' : ''
                  }`}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-200"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234567890123456"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 ${
                    errors.cardNumber ? 'border-red-500' : ''
                  }`}
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.expiryDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentChange}
                  placeholder="123"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.cvv ? 'border-red-500' : ''
                  }`}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
          
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
          
          <div className="mt-8 flex space-x-4">
            <button
              type="button"
              onClick={handleBackToCustomerInfo}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition duration-200"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                'Complete Purchase'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;