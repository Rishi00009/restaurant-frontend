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

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        // Fetch restaurant details (name) and menu items
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
    <div className="container mx-auto py-6 px-4 relative bg-gray-50">
      <h1 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
        Menu for {restaurantName}
      </h1>

      <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 w-80">
        <h2 className="text-lg font-semibold text-gray-700">Cart</h2>
        {cart.length > 0 ? (
          <>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item._id} className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.name} (x{item.quantity})</span>
                  </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white shadow-lg rounded-lg p-4">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-gray-700 mt-2">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-lg font-semibold text-indigo-600 mt-2">${item.price}</p>
              <p className="text-gray-700 mt-2">
                <strong>Calories:</strong> {item.calories} kcal
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={() => viewReviews(item._id)}
                >
                  View Reviews
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItemReviews && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-1/2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h3>
            <ul className="space-y-2">
              {selectedItemReviews.length > 0 ? (
                selectedItemReviews.map((review, index) => (
                  <li key={index} className="text-sm text-gray-600 border-b pb-2">{review.comment}</li>
                ))
              ) : (
                <p className="text-gray-500">No reviews available for this item.</p>
              )}
            </ul>
            <button
              onClick={closeReviews}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
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
