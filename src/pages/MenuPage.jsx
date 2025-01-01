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
  const [selectedItemReviews, setSelectedItemReviews] = useState(null);
  const [customizations, setCustomizations] = useState({});

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const restaurantResponse = await axios.get(`https://restaurant-backend-yx5h.onrender.com/api/restaurants/${restaurantId}`);
        setRestaurantName(restaurantResponse.data.name);

        const menuResponse = await axios.get(`https://restaurant-backend-yx5h.onrender.com/api/menu/${restaurantId}`);
        setMenuItems(menuResponse.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      }
    };

    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const handleCustomizationChange = (itemId, specialInstructions) => {
    setCustomizations((prevCustomizations) => ({
      ...prevCustomizations,
      [itemId]: { specialInstructions }
    }));
  };

  const addToCart = (menuItem) => {
    const { specialInstructions } = customizations[menuItem._id] || { specialInstructions: '' };

    setCart((prevCart) => {
      const itemExists = prevCart.find(
        (item) => item._id === menuItem._id && item.specialInstructions === specialInstructions
      );

      let updatedCart;
      if (itemExists) {
        updatedCart = prevCart.map((item) =>
          item._id === menuItem._id && item.specialInstructions === specialInstructions
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          { ...menuItem, quantity: 1, totalPrice: menuItem.price, specialInstructions }
        ];
      }

      const newTotalAmount = updatedCart.reduce((total, item) => total + item.totalPrice, 0);
      setTotalAmount(newTotalAmount);
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    navigate('/cart', { state: { cart, totalAmount } });
  };

  const viewReviews = (itemId) => {
    const item = menuItems.find((item) => item._id === itemId);
    if (item && item.reviews) {
      setSelectedItemReviews(item.reviews);
    }
  };

  const closeReviews = () => {
    setSelectedItemReviews(null);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading menu...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Restaurant Header */}
      <div className="bg-indigo-600 py-6 shadow-lg">
        <h1 className="text-4xl text-white font-semibold text-center">{restaurantName} Menu</h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Cart Sidebar */}
        <div className="fixed top-16 right-4 bg-white shadow-xl rounded-lg p-4 w-80 z-50">
          <h2 className="text-lg font-semibold text-gray-700">Cart</h2>
          {cart.length > 0 ? (
            <div className="space-y-2 mt-2">
              {cart.map((item) => (
                <div key={item._id} className="flex flex-col">
                  <span className="text-gray-700 font-medium">{item.name} (x{item.quantity})</span>
                  {item.specialInstructions && (
                    <span className="text-sm text-gray-500">Note: {item.specialInstructions}</span>
                  )}
                  <span className="text-sm text-gray-600">Total: ${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <p className="text-gray-700 font-semibold mt-4">Grand Total: ${totalAmount.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-blue-600"
              >
                Checkout
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-800 font-semibold mt-2">${item.price}</p>
                <p className="text-sm text-gray-500 mt-2">Calories: {item.calories} kcal</p>

                {/* Ingredients Section */}
                <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Ingredients:</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {item.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg shadow-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

                {/* Customization */}
                <textarea
                  placeholder="Add special instructions"
                  className="w-full mt-2 p-2 border rounded-lg text-sm text-gray-600"
                  onChange={(e) => handleCustomizationChange(item._id, e.target.value)}
                ></textarea>

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    onClick={() => viewReviews(item._id)}
                  >
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Modal */}
      {selectedItemReviews && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-2/3">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {selectedItemReviews.length > 0 ? (
              <ul className="space-y-2">
                {selectedItemReviews.map((review, index) => (
                  <li key={index} className="border-b pb-2 text-gray-600">{review.comment}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews available.</p>
            )}
            <button
              className="bg-indigo-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-indigo-600"
              onClick={closeReviews}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
