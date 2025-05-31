import React from 'react';
import { Product, ProductVariant } from '../data/products';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductDisplayProps {
  product: Product;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  const navigate = useNavigate();
  const { selectedVariant, setSelectedVariant, quantity, setQuantity } = useCart();

  // Set the first variant as default if none is selected
  React.useEffect(() => {
    if (!selectedVariant && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant, setSelectedVariant]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleBuyNow = () => {
    if (selectedVariant) {
      navigate('/checkout');
    }
  };

  if (!selectedVariant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img 
            src={selectedVariant.image} 
            alt={selectedVariant.name} 
            className="w-full h-[400px] object-cover"
          />
        </div>
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">${selectedVariant.price.toFixed(2)}</span>
            {selectedVariant.inventory < 5 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                Only {selectedVariant.inventory} left!
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <VariantSelector 
              variants={product.variants} 
              selectedVariant={selectedVariant} 
              onVariantChange={handleVariantChange} 
            />
          </div>
          
          <div className="mb-8">
            <QuantitySelector 
              quantity={quantity} 
              maxQuantity={selectedVariant.inventory} 
              onQuantityChange={handleQuantityChange} 
            />
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <Package className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {selectedVariant.inventory > 0 
                ? `In stock (${selectedVariant.inventory} available)` 
                : 'Out of stock'}
            </span>
          </div>
          
          <button 
            onClick={handleBuyNow}
            disabled={selectedVariant.inventory === 0}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;