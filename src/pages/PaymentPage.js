import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutForm = ({ cart, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = { name: 'John Doe' }; // Example user data, replace with actual data

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    const card = elements.getElement(CardElement);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/payments/intent`, {
        amount: totalAmount,
        savePaymentMethod: true,
      });

      const { paymentIntent } = data;

      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card,
          billing_details: {
            name: user.name, // Dynamic user name
          },
        },
      });

      if (result.error) {
        setPaymentStatus('Payment failed: ' + result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment successful!');
        // Redirect or handle success, e.g., to a success page
        window.location.href = '/payment-success'; // Example redirect
      }
    } catch (error) {
      setPaymentStatus('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="w-full max-w-md mx-auto">
      <CardElement className="border p-2 rounded mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
      </button>
      {paymentStatus && <p className="mt-4 text-gray-700">{paymentStatus}</p>}
    </form>
  );
};

const PaymentPage = () => {
  const { state } = useLocation();
  const cart = state?.cart || [];
  const totalAmount = state?.totalAmount || 0;

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Secure Payment</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <CheckoutForm cart={cart} totalAmount={totalAmount} />
        )}
      </div>
    </Elements>
  );
};

export default PaymentPage;
