import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [search, setSearch] = useState({ location: '', cuisine: '', minRating: '', maxPrice: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Using localStorage for token
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'customer'); // Add role to track the user type
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  // Filter restaurants based on search criteria
  const filterRestaurants = useCallback(() => {
    const { location, cuisine, minRating, maxPrice } = search;
    const filtered = restaurants.filter((restaurant) => {
      return (
        (location === '' || restaurant.location.toLowerCase().includes(location.toLowerCase())) &&
        (cuisine === '' || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())) &&
        (minRating === '' || restaurant.rating >= parseFloat(minRating)) &&
        (maxPrice === '' || restaurant.price <= parseFloat(maxPrice))
      );
    });
    setFilteredRestaurants(filtered);
  }, [restaurants, search]);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://restaurant-backend-yx5h.onrender.com/api/restaurants');
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
    } catch (error) {
      setError('Failed to load restaurants.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUserRole('customer');
    navigate('/');
  };

  // Navigate to the user data management page
  const handleManageUserData = () => {
    navigate('/manage-users');
  };

  // Fetch the restaurant data when the component loads
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Apply filters when search state changes
  useEffect(() => {
    filterRestaurants();
  }, [search, restaurants, filterRestaurants]);

  if (loading) {
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Navbar with Login/Signup or Logout buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600">Restaurant Listings</h1>
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
              {userRole === 'owner' && (
                <button
                  onClick={() => navigate(`/manage-restaurant/your-restaurant-id`)} // Pass correct restaurant ID
                  className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                  Manage Restaurant
                </button>
              )}
              {userRole === 'admin' && (
                <button
                  onClick={handleManageUserData}
                  className="bg-yellow-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                >
                  Manage User Data
                </button>
              )}
              <button
                onClick={() => navigate('/track-order')}
                className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
              >
                Track Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Filters Section */}
      <div className="flex justify-center items-center mb-8 space-x-4">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={search.location}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          value={search.cuisine}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="minRating"
          placeholder="Min Rating"
          value={search.minRating}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={search.maxPrice}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Restaurant List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
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
                <p className="text-yellow-500 mt-2">
                  Rating: {restaurant.rating ? restaurant.rating : 'Not rated yet'}
                </p>
                <p className="text-gray-500 mt-2">Price: ${restaurant.price || 'N/A'}</p>
                {token && (
                  <Link
                    to={`/menu/${restaurant._id}`}
                    className="text-blue-500 mt-4 inline-block hover:underline"
                  >
                    View Menu
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No restaurants match your search.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
