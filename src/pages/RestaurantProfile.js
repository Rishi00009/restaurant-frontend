import React, { useState } from 'react';
import axios from 'axios';

const RestaurantProfile = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',  // Changed from image to imageUrl
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setRestaurantName(e.target.value);
  };

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    if (!restaurantName) {
      setError('Please enter a restaurant name.');
      return;
    }
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      // Fetch restaurant by name
      const response = await axios.get('http://localhost:5000/api/restaurants', {
        params: { name: restaurantName },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if the restaurant list is not empty
      if (response.data.length === 0) {
        setError('Restaurant not found. Please try a different name.');
        setRestaurant(null); // Reset restaurant data
        return;
      }

      // Assuming you want the first restaurant from the returned list
      const selectedRestaurant = response.data[0];

      setRestaurant(selectedRestaurant);
      setFormData({
        name: selectedRestaurant.name || '',
        description: selectedRestaurant.description || '',
        imageUrl: selectedRestaurant.image || '',  // Set the image URL from the fetched restaurant
      });
      setImagePreview(selectedRestaurant.image || null);
    } catch (err) {
      console.error('Error fetching restaurant profile:', err);
      setError('Error fetching restaurant profile.');
      setRestaurant(null); // Reset restaurant data
    } finally {
      setLoading(false);
    }
  };

  const handleInputChangeProfile = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      imageUrl: value,
    }));

    // Validate image URL and update preview if valid
    if (value && isValidUrl(value)) {
      setImagePreview(value);
    }
  };

  const isValidUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
      '((([A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)(\\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)*|(' +
      '(\\d{1,3}\\.){3}\\d{1,3}))' + // domain
      '|([A-Za-z0-9-]+\\.[A-Za-z0-9]{2,}))(\\:\\d+)?(\\/[-A-Z0-9+&@#/%=~_|$]*)?' + // path
      '(\\?[A-Z0-9+&@#/%=~_|$]*)?' + // query string
      '(\\#[-A-Z0-9]*?)$', 'i');
    return pattern.test(url);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    // Debugging: Check if restaurant object exists and has the _id
    console.log('Restaurant object:', restaurant);
    console.log('Restaurant ID:', restaurant?._id);

    // Ensure restaurant and _id are available before proceeding
    if (!restaurant || !restaurant._id) {
      setError('Restaurant ID is missing.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${restaurant._id}`,
        {
          name: formData.name,
          description: formData.description,
          imageUrl: formData.imageUrl,  // Send the image URL
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Restaurant profile updated successfully!');
      setRestaurant(null);
      setRestaurantName('');
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
      });
      setImagePreview(null);
    } catch (err) {
      console.error('Error updating restaurant profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-4">Search Restaurant Profile</h2>
      <form onSubmit={handleSubmitSearch} className="mb-6">
        <input
          type="text"
          value={restaurantName}
          onChange={handleInputChange}
          placeholder="Enter Restaurant Name"
          className="border rounded-lg px-4 py-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 mt-4 transition duration-300"
        >
          Search Restaurant
        </button>
      </form>

      {loading && <p>Loading restaurant profile...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {restaurant && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Manage Restaurant Profile</h3>
          <form onSubmit={handleSubmitUpdate}>
            <div>
              <label className="block font-semibold mb-1">Restaurant Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChangeProfile}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Enter your restaurant's name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChangeProfile}
                rows="4"
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Enter a description for your restaurant"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image URL:</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Enter image URL"
              />
            </div>
            {imagePreview && (
              <div className="mb-4">
                <p>Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview of restaurant"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 mt-4 transition duration-300"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;
