import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import AdminRestaurantPage from './pages/AdminRestaurantPage';
import UserProfile from './pages/UserProfile';
import axios from 'axios';
import RestaurantProfile from './pages/RestaurantProfile';
import OrderStatus from './pages/OrderStatus'; // Correct import
import PaymentHistoryPage from './pages/PaymentHistoryPage';

const App = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cart, setCart] = useState([]); // Initialize cart state
  const token = localStorage.getItem('token'); // Get token for route protection

  // Fetch restaurants from the API
  useEffect(() => {
    axios.get('https://restaurant-backend-yx5h.onrender.com/api/restaurants').then((response) => {
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
        <Route path="/menu/:restaurantId" element={<MenuPage addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/restaurants" element={token ? <AdminRestaurantPage /> : <Navigate to="/auth" />} />
        <Route path="/user/profile" element={token ? <UserProfile /> : <Navigate to="/auth" />} />
        <Route path="/payment" element={token ? <PaymentPage cart={cart} /> : <Navigate to="/auth" />} />
        <Route path="/restaurant/profile" element={token ? <RestaurantProfile /> : <Navigate to="/auth" />} />
        
        {/* Route for OrderStatus page */}
        <Route
          path="/order/:orderId"
          element={token ? <OrderStatus /> : <Navigate to="/auth" />}
        />
        
        <Route path="/payment-history" element={token ? <PaymentHistoryPage /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;
