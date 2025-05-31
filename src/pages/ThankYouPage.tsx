import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { getVariantById } from '../data/products';
import { Order } from '../data/db';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useDatabase();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Update the page title when the component mounts
    document.title = 'ShopSimple - Order Confirmation';
    
    // Fetch the order data
    if (orderId) {
      const orderData = getOrder(orderId);
      if (orderData) {
        setOrder(orderData);
      }
      setLoading(false);
    }
  }, [orderId, getOrder]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg inline-flex items-center mb-4">
          <XCircle className="h-6 w-6 mr-2" />
          Order not found
        </div>
        <p className="text-gray-600 mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to home
        </Link>
      </div>
    );
  }
  
  const variant = getVariantById(order.productVariantId);
  
  // Determine status details based on transaction outcome
  const statusConfig = {
    approved: {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: 'Payment Approved',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      message: 'Your order has been successfully processed and confirmed.'
    },
    declined: {
      icon: <XCircle className="h-8 w-8 text-red-500" />,
      title: 'Payment Declined',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      message: 'Your payment was declined. Please try a different payment method.'
    },
    error: {
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      title: 'Processing Error',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      message: 'We encountered an error while processing your payment. No charges were made.'
    }
  };
  
  const status = statusConfig[order.status];
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {order.status === 'approved' ? 'Thank You!' : 'Order Status'}
        </h1>
        <p className="text-gray-600">
          {order.status === 'approved' 
            ? 'Your order has been placed successfully.' 
            : 'We\'ve processed your order request.'}
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className={`p-6 ${status.bgColor} rounded-lg mb-8 flex items-center`}>
          {status.icon}
          <div className="ml-4">
            <h2 className={`text-lg font-semibold ${status.textColor}`}>
              {status.title}
            </h2>
            <p className="text-gray-600">{status.message}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Number</h3>
              <p className="text-lg font-medium text-gray-900">{order.orderNumber}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Date</h3>
              <p className="text-gray-900">{order.createdAt.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            
            <div className="flex items-start">
              {variant && (
                <img 
                  src={variant.image} 
                  alt={variant.name} 
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              
              <div className="ml-4">
                <h4 className="text-md font-medium text-gray-900">
                  {variant ? variant.name : 'Product'}
                </h4>
                <p className="text-gray-600">Quantity: {order.quantity}</p>
                <div className="mt-2">
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-2 font-medium">${(order.subtotal / order.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span className="text-blue-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
              <p className="font-medium text-gray-900">{order.customer.fullName}</p>
              <p className="text-gray-600">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
              <p className="text-gray-900">{order.customer.address}</p>
              <p className="text-gray-900">
                {order.customer.city}, {order.customer.state} {order.customer.zipCode}
              </p>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
            <p className="text-gray-900">
              Credit Card ending in {order.paymentInfo.cardNumber.slice(-4)}
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {order.status === 'approved' 
              ? 'A confirmation email has been sent to your email address.' 
              : 'An email with details about your order status has been sent to your email address.'}
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;