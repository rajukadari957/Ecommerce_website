import { v4 as uuidv4 } from 'uuid';
import { getVariantById } from './products';

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export type TransactionStatus = 'approved' | 'declined' | 'error';

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  paymentInfo: PaymentInfo;
  productVariantId: string;
  quantity: number;
  subtotal: number;
  total: number;
  status: TransactionStatus;
  createdAt: Date;
}

// In-memory database
const orders: Order[] = [];

// Generate a unique order number
function generateOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}

// Create a new order
export function createOrder(
  customer: Customer,
  paymentInfo: PaymentInfo,
  productVariantId: string,
  quantity: number,
  subtotal: number,
  total: number
): Order {
  // Simulate updating inventory
  const variant = getVariantById(productVariantId);
  if (variant) {
    variant.inventory -= quantity;
  }

  // Create a new order
  const order: Order = {
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    customer,
    paymentInfo,
    productVariantId,
    quantity,
    subtotal,
    total,
    status: simulateTransaction(),
    createdAt: new Date()
  };

  // Save the order to our "database"
  orders.push(order);
  return order;
}

// Get an order by ID
export function getOrderById(id: string): Order | undefined {
  return orders.find(order => order.id === id);
}

// Simulate a transaction with random outcomes
export function simulateTransaction(): TransactionStatus {
  const rand = Math.random();
  // 70% chance of approval, 20% chance of decline, 10% chance of error
  if (rand < 0.7) return 'approved';
  if (rand < 0.9) return 'declined';
  return 'error';
}