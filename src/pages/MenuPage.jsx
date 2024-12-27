import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        if (!restaurantId) {
          setError('Restaurant ID is undefined');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response) {
          setError(`Error: ${err.response.data.message || 'Failed to load menu items.'}`);
        } else if (err.request) {
          setError('No response from server.');
        } else {
          setError(`Request error: ${err.message}`);
        }
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const addToCart = (menuItem) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item._id === menuItem._id);
      
      let updatedCart;
      if (itemExists) {
        updatedCart = prevCart.map((item) =>
          item._id === menuItem._id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...menuItem, quantity: 1, totalPrice: menuItem.price }];
      }

      const newTotalAmount = updatedCart.reduce((total, item) => total + item.totalPrice, 0);
      setTotalAmount(newTotalAmount);
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    // Redirect to the CartPage with the cart data
    navigate('/cart', { state: { cart, totalAmount } });
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading menu...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Cart UI */}
      <div className="fixed top-4 left-4 bg-white shadow-lg rounded-lg p-4 z-50 w-80">
        <h2 className="text-lg font-semibold text-gray-700">Cart</h2>
        {cart.length > 0 ? (
          <>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-sm">{item.name} (x{item.quantity})</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 mt-2">Total: ${totalAmount.toFixed(2)}</p>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
            >
              Checkout
            </button>
          </>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
        Menu for Restaurant {restaurantId}
      </h1>
      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.image || 'https://via.placeholder.com/300'}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-indigo-700">{item.name}</h2>
                <p className="text-gray-500">{item.description}</p>
                <p className="text-gray-700 font-bold mt-2">${item.price}</p>
                <button
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No menu items available.</p>
      )}
    </div>
  );
};

export default MenuPage;


