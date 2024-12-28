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
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    console.log("Fetching menu items for restaurantId:", restaurantId);

    // Fetch restaurant details (name) and menu items
    const fetchRestaurantAndMenu = async () => {
      try {
        // Fetch restaurant data to get the name
        const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        setRestaurantName(restaurantResponse.data.name);

        // Fetch menu items for the restaurant
        const menuResponse = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
        setMenuItems(menuResponse.data);
        
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      }
    };

    fetchRestaurantAndMenu();
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
    <div className="container mx-auto py-6 px-4 relative bg-gray-50"> {/* Simple background color */}
      {/* Cart UI - Positioned fixed */}
      <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 w-80">
        <h2 className="text-lg font-semibold text-gray-700">Cart</h2>
        {cart.length > 0 ? (
          <>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{item.name} (x{item.quantity})</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700 mt-2">Total: ${totalAmount.toFixed(2)}</p>
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

      <h1 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
        Menu for {restaurantName}
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
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-800 font-bold mt-2 text-lg">${item.price}</p>

                {/* Display ingredients and calories */}
                <div className="mt-2 text-sm text-gray-500">
                  <p><strong>Ingredients:</strong> {item.ingredients.join(", ")}</p>
                  <p><strong>Calories:</strong> {item.calories}</p>
                </div>

                {/* Display tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
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
