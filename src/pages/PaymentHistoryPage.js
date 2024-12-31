import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/payments/history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then((response) => setPayments(response.data.payments))
    .catch((error) => console.error('Error fetching payment history:', error));
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Payment History</h1>
      {payments.length === 0 ? (
        <p>No payment history available.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <li key={payment.id} className="py-4 flex justify-between">
              <span>{new Date(payment.created * 1000).toLocaleString()}</span>
              <span>₹{(payment.amount / 100).toFixed(2)}</span>
              <span>{payment.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
