import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://restaurant-backend-yx5h.onrender.com/api/restaurants') // Ensure this is the correct API endpoint
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
    <div className="container mx-auto py-8 px-4 bg-indigo-50"> {/* Mild pastel background color */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Restaurant Listings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300"
            >
              <img
                src={restaurant.image || 'https://via.placeholder.com/300'}
                alt={restaurant.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">{restaurant.name}</h2>
                <p className="text-gray-600 mt-2">{restaurant.cuisine}</p>
                <p className="text-gray-500 text-sm">{restaurant.location}</p>

                {/* Rating */}
                <p className="text-yellow-400 mt-2 text-sm">
                  Rating: {restaurant.rating ? restaurant.rating : 'Not rated yet'}
                </p>

                {/* Price Range */}
                <p className="text-gray-600 text-sm mt-2">
                  Price Range: ${restaurant.price} (estimate)
                </p>

                {/* Open Hours */}
                <p className="text-gray-600 text-sm mt-2">
                  Open Hours: {restaurant.hours || 'Hours not available'}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-2">
                  {restaurant.description || 'No description available'}
                </p>

                {/* Actions */}
                <div className="mt-4 flex justify-between items-center">
                <Link
                    to={`/menu/${restaurant._id}`}
                    className="text-indigo-600 hover:bg-indigo-100 text-lg font-semibold py-3 px-6 rounded-lg border-2 border-indigo-600 transition-colors duration-300"
                  >
                    View Menu
                  </Link>
                                    <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Add to Favorites
                  </button>
                </div>
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

export default RestaurantListPage;
