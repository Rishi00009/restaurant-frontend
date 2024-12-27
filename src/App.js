import React, { useState, useEffect } from 'react'; // Add this import statement
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import AdminRestaurantPage from './pages/AdminRestaurantPage';
import UserProfile from './pages/UserProfile';
import axios from 'axios';

const App = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cart, setCart] = useState([]); // Initialize cart state

  // Fetch restaurants from the API
  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants').then((response) => {
      setRestaurants(response.data);
    });
  }, []);

  // Function to add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1, price: cartItem.price + item.price }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Function to remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage restaurants={restaurants} addToCart={addToCart} />} />
        <Route path="/menu/:restaurantId" element={<MenuPage addToCart={addToCart} />} />  {/* Pass addToCart function */}
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/restaurants" element={<AdminRestaurantPage />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/payment" element={<PaymentPage cart={cart} />} /> {/* Pass cart to PaymentPage */}
      </Routes>
    </Router>
  );
};

export default App;
