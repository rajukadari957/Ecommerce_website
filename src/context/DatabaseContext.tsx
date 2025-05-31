import React, { createContext, useContext, ReactNode } from 'react';
import { 
  createOrder, 
  getOrderById, 
  Customer, 
  PaymentInfo, 
  Order 
} from '../data/db';
import { sendOrderConfirmationEmail } from '../services/emailService';

interface DatabaseContextType {
  createNewOrder: (
    customer: Customer,
    paymentInfo: PaymentInfo,
    productVariantId: string,
    quantity: number,
    subtotal: number,
    total: number
  ) => Promise<Order>;
  getOrder: (id: string) => Order | undefined;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create a new order and send confirmation email
  const createNewOrder = async (
    customer: Customer,
    paymentInfo: PaymentInfo,
    productVariantId: string,
    quantity: number,
    subtotal: number,
    total: number
  ): Promise<Order> => {
    // Create the order in our "database"
    const order = createOrder(
      customer,
      paymentInfo,
      productVariantId,
      quantity,
      subtotal,
      total
    );
    
    // Send confirmation email based on the transaction status
    await sendOrderConfirmationEmail(order);
    
    return order;
  };
  
  // Get an order by ID
  const getOrder = (id: string): Order | undefined => {
    return getOrderById(id);
  };
  
  return (
    <DatabaseContext.Provider
      value={{
        createNewOrder,
        getOrder
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};