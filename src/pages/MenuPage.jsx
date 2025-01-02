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

        if (menuRes.data.length > 0) {
          setMenuItems(menuRes.data);
        } else {
          setError('No menu items available for this restaurant.');
        }

        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const addToCart = (menuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === menuItem._id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === menuItem._id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...menuItem, quantity: 1, totalPrice: menuItem.price }];
      }

      setTotalAmount(updatedCart.reduce((total, item) => total + item.totalPrice, 0));
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    navigate('/cart', { state: { cart, totalAmount } });
  };

  if (loading) return <p className="text-center text-gray-500">Loading menu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-indigo-600 py-6 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-white">{restaurantName} Menu</h1>
      </header>

      {/* Content */}
      <main className="container mx-auto py-10 px-4 flex flex-col lg:flex-row gap-10">
        {/* Menu Items */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{item.description || 'No description available.'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Category:</span> {item.category || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Calories:</span> {item.calories || 'N/A'} kcal
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium">Ingredients:</span> {item.ingredients?.join(', ') || 'N/A'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-600 py-1 px-2 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 font-medium mt-3">Price: ${item.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Cart */}
        <aside className="bg-white rounded-lg shadow-md p-6 w-full lg:w-96">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-4">Your Cart</h2>
          {cart.length > 0 ? (
            <div className="mt-4 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-800 font-medium">{item.name}</h3>
                    <p className="text-gray-600 text-sm">x{item.quantity}</p>
                  </div>
                  <p className="text-gray-800 font-semibold">${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total: ${totalAmount.toFixed(2)}
                </h3>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Checkout
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
          )}
        </aside>
      </main>
    </div>
  );
};

export default MenuPage;
