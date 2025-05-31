import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import Layout from './components/Layout';
import { CartProvider } from './context/CartContext';
import { DatabaseProvider } from './context/DatabaseContext';

function App() {
  return (
    <Router>
      <DatabaseProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thank-you/:orderId" element={<ThankYouPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </DatabaseProvider>
    </Router>
  );
}

export default App;