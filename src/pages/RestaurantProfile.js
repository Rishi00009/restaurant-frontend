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
    imageUrl: '',
  });
  const [menuData, setMenuData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: '',
    ingredients: '',
    calories: '',
    tags: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setRestaurantName(e.target.value);
    setError(null); // Clear errors when the user starts typing
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!restaurantName.trim()) {
      setError('Please enter a restaurant name.');
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('https://restaurant-backend-yx5h.onrender.com/api/restaurants', {
        params: { name: restaurantName },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || response.data.length === 0) {
        setError('No restaurant found. Please try a different name.');
        setRestaurant(null);
        return;
      }

      const fetchedRestaurant = response.data[0];
      setRestaurant(fetchedRestaurant);
      setFormData({
        name: fetchedRestaurant.name || '',
        description: fetchedRestaurant.description || '',
        imageUrl: fetchedRestaurant.image || '',
      });
      setImagePreview(fetchedRestaurant.image || null);
    } catch (err) {
      setError('Error fetching restaurant profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'imageUrl' && isValidUrl(value)) {
      setImagePreview(value);
    } else if (name === 'imageUrl') {
      setImagePreview(null);
    }
  };

  const handleMenuFormChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!restaurant || !restaurant._id) {
      setError('Restaurant data is missing. Please search and select a restaurant first.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `https://restaurant-backend-yx5h.onrender.com/api/restaurants/${restaurant._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
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
      setError('Error updating restaurant profile. Please try again.');
      console.error(err);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    if (!restaurant || !restaurant._id) {
      setError('Restaurant data is missing. Please search and select a restaurant first.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!menuData.name || !menuData.price || !menuData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const menuItem = {
        ...menuData,
        restaurantId: restaurant._id,
        price: parseFloat(menuData.price),
        calories: parseInt(menuData.calories, 10),
        ingredients: menuData.ingredients.split(','),
        tags: menuData.tags.split(','),
      };

      await axios.post(
        `https://restaurant-backend-yx5h.onrender.com/api/menuItems`,
        menuItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Menu item added successfully!');
      setMenuData({
        name: '',
        description: '',
        category: '',
        price: '',
        imageUrl: '',
        ingredients: '',
        calories: '',
        tags: '',
      });
      setImagePreview(null);  // Clear image preview
    } catch (err) {
      setError('Error adding menu item. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-4">Search Restaurant Profile</h2>
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <input
          type="text"
          value={restaurantName}
          onChange={handleInputChange}
          placeholder="Enter Restaurant Name"
          className="border rounded-lg px-4 py-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading restaurant profile...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {restaurant && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Manage Restaurant Profile</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div>
              <label className="block font-semibold mb-1">Restaurant Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Restaurant name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="4"
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Restaurant description"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image URL:</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Image URL"
              />
            </div>
            {imagePreview && (
              <div className="mb-4">
                <p>Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Update Profile
            </button>
          </form>

          <hr className="my-6" />

          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Add Menu Item</h3>
          <form onSubmit={handleAddMenuItem}>
            <div>
              <label className="block font-semibold mb-1">Menu Item Name:</label>
              <input
                type="text"
                name="name"
                value={menuData.name}
                onChange={handleMenuFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Menu item name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description:</label>
              <textarea
                name="description"
                value={menuData.description}
                onChange={handleMenuFormChange}
                rows="4"
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Menu item description"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Category:</label>
              <input
                type="text"
                name="category"
                value={menuData.category}
                onChange={handleMenuFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Menu item category"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Price:</label>
              <input
                type="number"
                name="price"
                value={menuData.price}
                onChange={handleMenuFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Price"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Ingredients:</label>
              <input
                type="text"
                name="ingredients"
                value={menuData.ingredients}
                onChange={handleMenuFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Comma separated ingredients"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Calories:</label>
              <input
                type="number"
                name="calories"
                value={menuData.calories}
                onChange={handleMenuFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Calories"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tags:</label>
              <input
                type="text"
                name="tags"
                value={menuData.tags}
                onChange={handleMenuFormChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
                placeholder="Comma separated tags"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
              Add Menu Item
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;
