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
  const [isOwner, setIsOwner] = useState(localStorage.getItem('role') === 'owner'); // Check if the user is the owner

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
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-700 font-semibold mt-2">${item.price}</p>

                {/* Reviews Section */}
                <button
                  onClick={() => viewReviews(item._id)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  View Reviews
                </button>

                {/* Special Instructions (only visible for owners) */}
                {isOwner && (
                  <input
                    type="text"
                    value={customizations[item._id]?.specialInstructions || ''}
                    onChange={(e) => handleCustomizationChange(item._id, e.target.value)}
                    placeholder="Special Instructions"
                    className="mt-2 p-2 border rounded-lg w-full"
                  />
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(item)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Modal */}
        {selectedItemReviews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
              <button onClick={closeReviews} className="text-red-500 text-lg absolute top-2 right-2">
                X
              </button>
              <div className="space-y-2">
                {selectedItemReviews.map((review, index) => (
                  <div key={index}>
                    <p className="font-semibold">{review.username}</p>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
