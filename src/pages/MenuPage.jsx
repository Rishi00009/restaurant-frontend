import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [selectedItemReviews, setSelectedItemReviews] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const isOwner = localStorage.getItem('role') === 'owner';

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const restaurantRes = await axios.get(
          `https://restaurant-backend-yx5h.onrender.com/api/restaurants/${restaurantId}`
        );
        setRestaurantName(restaurantRes.data.name);

        const menuRes = await axios.get(
          `https://restaurant-backend-yx5h.onrender.com/api/menu/${restaurantId}`
        );
        setMenuItems(menuRes.data);

        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const handleCustomizationChange = (itemId, specialInstructions) => {
    setCustomizations((prev) => ({
      ...prev,
      [itemId]: { specialInstructions },
    }));
  };

  const addToCart = (menuItem) => {
    const { specialInstructions } = customizations[menuItem._id] || { specialInstructions: '' };

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === menuItem._id && item.specialInstructions === specialInstructions
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === menuItem._id && item.specialInstructions === specialInstructions
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          { ...menuItem, quantity: 1, totalPrice: menuItem.price, specialInstructions },
        ];
      }

      setTotalAmount(updatedCart.reduce((total, item) => total + item.totalPrice, 0));
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    navigate('/cart', { state: { cart, totalAmount } });
  };

  const viewReviews = (itemId) => {
    const item = menuItems.find((item) => item._id === itemId);
    if (item?.reviews) {
      setSelectedItemReviews(item.reviews);
    }
  };

  const closeReviews = () => {
    setSelectedItemReviews(null);
  };

  if (loading) return <p className="text-center text-gray-500">Loading menu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Restaurant Header */}
      <header className="bg-indigo-600 py-6 shadow-lg text-center">
        <h1 className="text-4xl text-white font-semibold">{restaurantName} Menu</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 grid gap-6 lg:grid-cols-3">
        {/* Menu Items */}
        <section className="lg:col-span-2 grid gap-6">
          {menuItems.map((item) => (
            <article key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-700 font-semibold mt-2">${item.price.toFixed(2)}</p>

                <button
                  onClick={() => viewReviews(item._id)}
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  View Reviews
                </button>

                {isOwner && (
                  <input
                    type="text"
                    value={customizations[item._id]?.specialInstructions || ''}
                    onChange={(e) => handleCustomizationChange(item._id, e.target.value)}
                    placeholder="Special Instructions"
                    className="mt-2 p-2 border rounded-lg w-full"
                  />
                )}

                <button
                  onClick={() => addToCart(item)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Cart Sidebar */}
        <aside className="bg-white shadow-xl rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Cart</h2>
          {cart.length > 0 ? (
            <>
              {cart.map((item) => (
                <div key={item._id} className="mt-4">
                  <p className="font-medium text-gray-700">{item.name} (x{item.quantity})</p>
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-500">Note: {item.specialInstructions}</p>
                  )}
                  <p className="text-sm text-gray-600">Total: ${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
              <p className="text-gray-700 font-semibold mt-4">Grand Total: ${totalAmount.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-blue-600"
              >
                Checkout
              </button>
            </>
          ) : (
            <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
          )}
        </aside>
      </main>

      {/* Reviews Modal */}
      {selectedItemReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg relative w-96">
            <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
            <button
              onClick={closeReviews}
              className="absolute top-2 right-2 text-red-500 text-lg"
            >
              ×
            </button>
            {selectedItemReviews.map((review, idx) => (
              <div key={idx} className="mt-2">
                <p className="font-semibold">{review.username}</p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
