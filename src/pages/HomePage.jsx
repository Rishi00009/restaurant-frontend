import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/restaurants')
      .then((response) => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
        setError('Failed to load restaurants.');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleUserManagement = () => {
    // Navigate to the user profile page
    navigate('/user/profile');
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Navbar with Login/Signup or Logout buttons - Centered */}
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600 mr-4">Restaurant Listings</h1>
        <div className="flex items-center space-x-4">
          {!token ? (
            <Link
              to="/auth"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Login / Sign Up
            </Link>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
              <button
                onClick={handleUserManagement}
                className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                Manage Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Restaurant List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={restaurant.image || 'https://via.placeholder.com/300'}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-indigo-700">{restaurant.name}</h2>
                <p className="text-gray-500 mt-2">{restaurant.cuisine}</p>
                <p className="text-gray-400">{restaurant.location}</p>
                <Link
                  to={`/menu/${restaurant._id}`}
                  className="text-blue-500 mt-4 inline-block hover:underline"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No restaurants available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
