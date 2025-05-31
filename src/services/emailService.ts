import { Order } from '../data/db';
import { getVariantById } from '../data/products';

// Generate the email content for an approved transaction
function generateApprovedEmailContent(order: Order): string {
  const variant = getVariantById(order.productVariantId);
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Order Confirmation</h1>
      <p>Dear ${order.customer.fullName},</p>
      <p>Thank you for your purchase! Your order has been successfully processed.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="margin-top: 0; color: #1e3a8a;">Order Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${order.createdAt.toLocaleString()}</p>
        
        <h3 style="margin-top: 16px; color: #1e3a8a;">Product</h3>
        <p><strong>Item:</strong> ${variant?.name || 'Product'}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Price:</strong> $${(order.subtotal / order.quantity).toFixed(2)}</p>
        
        <h3 style="margin-top: 16px; color: #1e3a8a;">Order Summary</h3>
        <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="margin-top: 0; color: #1e3a8a;">Shipping Information</h2>
        <p>${order.customer.fullName}</p>
        <p>${order.customer.address}</p>
        <p>${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}</p>
        <p>Email: ${order.customer.email}</p>
        <p>Phone: ${order.customer.phone}</p>
      </div>
      
      <p>If you have any questions about your order, please contact our customer support team.</p>
      <p>Thank you for shopping with us!</p>
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
        <p>This is a simulated transaction email for demonstration purposes only.</p>
      </div>
    </div>
  `;
}

// Generate the email content for a declined transaction
function generateDeclinedEmailContent(order: Order): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Transaction Declined</h1>
      <p>Dear ${order.customer.fullName},</p>
      <p>We regret to inform you that your recent transaction has been declined.</p>
      
      <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="margin-top: 0; color: #b91c1c;">Transaction Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${order.createdAt.toLocaleString()}</p>
        <p><strong>Status:</strong> Declined</p>
      </div>
      
      <p>This could be due to one of the following reasons:</p>
      <ul>
        <li>Insufficient funds in your account</li>
        <li>Card expiration date or CVV mismatch</li>
        <li>Card issuer declined the transaction</li>
        <li>Billing address verification failed</li>
      </ul>
      
      <p>Please try again with a different payment method or contact your bank for more information.</p>
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
        <p>This is a simulated transaction email for demonstration purposes only.</p>
      </div>
    </div>
  `;
}

// Generate the email content for an error transaction
function generateErrorEmailContent(order: Order): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Transaction Error</h1>
      <p>Dear ${order.customer.fullName},</p>
      <p>We encountered an unexpected error while processing your transaction.</p>
      
      <div style="background-color: #fef9c3; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="margin-top: 0; color: #854d0e;">Error Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Date:</strong> ${order.createdAt.toLocaleString()}</p>
        <p><strong>Status:</strong> Processing Error</p>
      </div>
      
      <p>This issue is on our end, and no charges have been made to your account.</p>
      <p>Our technical team has been notified and is working to resolve this issue.</p>
      <p>Please try again later or contact our customer support for assistance.</p>
      
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
        <p>This is a simulated transaction email for demonstration purposes only.</p>
      </div>
    </div>
  `;
}

// Send a confirmation email based on the order status
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  let subject: string;
  let htmlContent: string;
  
  // Select the appropriate email template based on the order status
  switch (order.status) {
    case 'approved':
      subject = `Order Confirmation: ${order.orderNumber}`;
      htmlContent = generateApprovedEmailContent(order);
      break;
    case 'declined':
      subject = `Transaction Declined: ${order.orderNumber}`;
      htmlContent = generateDeclinedEmailContent(order);
      break;
    case 'error':
      subject = `Transaction Error: ${order.orderNumber}`;
      htmlContent = generateErrorEmailContent(order);
      break;
  }
  
  // Simulate sending email by logging to console
  try {
    console.log('Email would be sent with the following details:');
    console.log('To:', order.customer.email);
    console.log('Subject:', subject);
    console.log('Content:', htmlContent.substring(0, 100) + '...');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}