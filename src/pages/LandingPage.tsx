import React, { useEffect, useState } from 'react';
import { products } from '../data/products';
import ProductDisplay from '../components/ProductDisplay';

const LandingPage: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);

  // Update the page title when the component mounts
  useEffect(() => {
    document.title = 'ShopSimple - Premium Products';
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our collection of premium products, from cutting-edge electronics to ergonomic office essentials.
        </p>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className={`p-4 rounded-lg transition-all ${
                selectedProductId === product.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border border-gray-200 hover:border-blue-300'
              }`}
            >
              <img
                src={product.variants[0].image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-blue-600 font-medium">
                From ${Math.min(...product.variants.map(v => v.price)).toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Selected Product</h2>
          <ProductDisplay product={selectedProduct} />
        </>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Premium Quality</h3>
          <p className="text-gray-600">
            All our products are carefully selected to ensure the highest quality and durability.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Free Shipping</h3>
          <p className="text-gray-600">
            Enjoy free shipping on all orders within the continental United States.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">2-Year Warranty</h3>
          <p className="text-gray-600">
            All products come with a comprehensive two-year warranty for your peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;