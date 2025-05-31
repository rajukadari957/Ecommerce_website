import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductVariant } from '../data/products';

interface CartContextType {
  selectedVariant: ProductVariant | null;
  quantity: number;
  subtotal: number;
  total: number;
  setSelectedVariant: (variant: ProductVariant) => void;
  setQuantity: (quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Calculate subtotal and total
  const subtotal = selectedVariant ? selectedVariant.price * quantity : 0;
  const total = subtotal; // In a real app, we might add tax, shipping, etc.
  
  // Clear the cart
  const clearCart = () => {
    setSelectedVariant(null);
    setQuantity(1);
  };
  
  return (
    <CartContext.Provider
      value={{
        selectedVariant,
        quantity,
        subtotal,
        total,
        setSelectedVariant,
        setQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};