import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/restaurants')
      .then((response) => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to load restaurants.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading restaurants...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
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
  );
};

export default RestaurantListPage;

