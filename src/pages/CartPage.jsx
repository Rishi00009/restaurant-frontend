import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart] = useState(state?.cart || []);
  const [totalAmount, setTotalAmount] = useState(state?.totalAmount || 0);
  const [deliveryType, setDeliveryType] = useState('immediate');
  const [deliveryDetails, setDeliveryDetails] = useState({ date: '', time: '', address: '' });

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cart]);

  const handleProceedToPayment = () => {
    if (deliveryType === 'scheduled' && (!deliveryDetails.date || !deliveryDetails.time)) {
      alert('Please select a valid delivery date and time.');
      return;
    }

    if (!deliveryDetails.address) {
      alert('Please enter a delivery address.');
      return;
    }

    navigate('/payment', {
      state: { cart, totalAmount, deliveryType, deliveryDetails },
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Your Cart</h1>

      {/* Delivery Type Selection */}
      <div className="mb-4">
        <label htmlFor="deliveryType" className="block text-gray-700">Delivery Type</label>
        <select
          id="deliveryType"
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
          className="w-full p-2 border rounded-lg mt-2"
        >
          <option value="immediate">Immediate</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Scheduled Delivery Inputs */}
      {deliveryType === 'scheduled' && (
        <div className="mb-4">
          <label htmlFor="deliveryDate" className="block text-gray-700">Delivery Date & Time</label>
          <input
            type="datetime-local"
            id="deliveryDate"
            value={deliveryDetails.date}
            onChange={(e) =>
              setDeliveryDetails({ ...deliveryDetails, date: e.target.value })
            }
            className="w-full p-2 border rounded-lg mt-2"
          />
        </div>
      )}

      {/* Address Input */}
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700">Delivery Address</label>
        <textarea
          id="address"
          value={deliveryDetails.address}
          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
          className="w-full p-2 border rounded-lg mt-2"
          placeholder="Enter your delivery address"
        />
      </div>

      {/* Total Amount */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Total: ₹{totalAmount.toFixed(2)}</h2>
      </div>

      {/* Proceed to Payment Button */}
      <button
        onClick={handleProceedToPayment}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Proceed to Payment
      </button>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <p className="mt-4 text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {cart.map((item) => (
            <div key={item._id} className="bg-white shadow-sm rounded-lg p-3 flex items-center gap-3">
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
