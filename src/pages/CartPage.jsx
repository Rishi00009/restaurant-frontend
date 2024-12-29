import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(state?.cart || []);
  const [totalAmount, setTotalAmount] = useState(state?.totalAmount || 0);

  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price);
      const itemQuantity = parseInt(item.quantity, 10);
      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        return acc + itemPrice * itemQuantity;
      }
      return acc;
    }, 0);

    setTotalAmount(total);
  }, [cart]);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    updateTotalAmount(updatedCart);
  };

  const handleQuantityChange = (id, action) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        if (action === 'increase') item.quantity += 1;
        else if (action === 'decrease' && item.quantity > 1) item.quantity -= 1;
      }
      return item;
    });

    setCart(updatedCart);
    updateTotalAmount(updatedCart);
  };

  const updateTotalAmount = (cartItems) => {
    const total = cartItems.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price);
      const itemQuantity = parseInt(item.quantity, 10);
      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        return acc + itemPrice * itemQuantity;
      }
      return acc;
    }, 0);

    setTotalAmount(total);
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { cart, totalAmount } });
  };

  const addReview = (id, review) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        item.reviews = item.reviews || []; // Initialize reviews array if not present
        item.reviews.push(review);
      }
      return item;
    });
    setCart(updatedCart);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-8">Your Cart</h1>

      {/* Total and Proceed to Payment at the top */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Total: ${totalAmount.toFixed(2)}</h2>
        <button
          onClick={handleProceedToPayment}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Proceed to Payment
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-lg text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col bg-white shadow-lg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-gray-700">{item.name}</h2>
                    <p className="text-gray-500">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(item._id, 'decrease')}
                    className="text-xl text-gray-500 hover:text-red-500"
                  >
                    -
                  </button>
                  <span className="text-lg text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 'increase')}
                    className="text-xl text-gray-500 hover:text-green-500"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-600">Reviews:</h3>
                <ul className="list-disc ml-5 mb-2">
                  {item.reviews?.map((review, index) => (
                    <li key={index} className="text-gray-700">{review}</li>
                  ))}
                </ul>
                <textarea
                  placeholder="Write a review"
                  className="border rounded-lg px-4 py-2 w-full mb-2"
                  rows="2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        addReview(item._id, e.target.value.trim());
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <small className="text-gray-400">
                  Press Enter to add your review.
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
