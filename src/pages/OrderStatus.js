import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  
import io from 'socket.io-client';
import axios from 'axios';

// Initialize socket connection
const socket = io('https://restaurant-backend-yx5h.onrender.com', { autoConnect: false });

const OrderStatus = () => {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState(null); // Start with null instead of 'Pending'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    // Fetch initial order status
    axios
      .get(`https://restaurant-backend-yx5h.onrender.com/api/orders/${orderId}/status`)
      .then((response) => {
        if (!response.data || !response.data.status) {
          setOrderStatus(null);
        } else {
          setOrderStatus(response.data.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching order status:', error);
        setError('Failed to fetch order status.');
      })
      .finally(() => setLoading(false)); // Set loading to false once fetch is complete

    // Connect socket and join room
    socket.connect();
    socket.emit('joinOrderRoom', orderId);

    // Listen for updates from the backend
    socket.on('orderStatusUpdated', (status) => {
      setOrderStatus(status);
    });

    // Cleanup on unmount
    return () => {
      socket.off('orderStatusUpdated');
      socket.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Loading...</h1>
        <p className="text-gray-600">Fetching your order status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (orderStatus === null) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Order Not Found</h1>
        <p className="text-gray-600">No order found for the given ID.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Order Status</h1>
      <p className="text-gray-600">
        Current Status: <span className="font-semibold">{orderStatus}</span>
      </p>
    </div>
  );
};

export default OrderStatus;
