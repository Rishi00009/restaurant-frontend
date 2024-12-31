import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart] = useState(state?.cart || []);
  const [totalAmount, setTotalAmount] = useState(state?.totalAmount || 0);
  const [deliveryType, setDeliveryType] = useState('immediate');
  const [deliveryDetails, setDeliveryDetails] = useState({ date: '', time: '' });

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cart]);

  const handleProceedToPayment = () => {
    if (deliveryType === 'scheduled' && (!deliveryDetails.date || !deliveryDetails.time)) {
      alert('Please select a valid delivery date and time.');
      return;
    }

    navigate('/payment', {
      state: { cart, totalAmount, deliveryType, deliveryDetails },
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Your Cart</h1>

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

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Total: ₹{totalAmount.toFixed(2)}</h2>
      </div>

      <button
        onClick={handleProceedToPayment}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Proceed to Payment
      </button>

      {cart.length === 0 ? (
        <p className="mt-4 text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {cart.map((item) => (
            <div key={item._id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="mt-2 font-bold text-gray-700">{item.name}</h3>
              <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
