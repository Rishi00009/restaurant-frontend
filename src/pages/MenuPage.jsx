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
        // Fetch restaurant details
        const restaurantRes = await axios.get(
          `https://restaurant-backend-yx5h.onrender.com/api/restaurants/${restaurantId}`
        );
        setRestaurantName(restaurantRes.data.name);

        // Fetch menu items
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
                <p className="text-gray-600">{item.description || 'No description available.'}</p>
                <p className="text-gray-700 font-semibold mt-2">
                  Category: {item.category || 'Uncategorized'}
                </p>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                <p className="text-gray-600 mt-2">Calories: {item.calories || 'N/A'}</p>
                <p className="text-gray-600">Ingredients: {item.ingredients?.join(', ') || 'N/A'}</p>
                <p className="text-gray-600 mt-2">
                  Tags: {item.tags?.join(', ') || 'No tags available'}
                </p>
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
    </div>
  );
};

export default MenuPage;
