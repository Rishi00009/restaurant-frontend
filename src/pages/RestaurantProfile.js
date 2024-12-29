import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null, // To handle new uploads
  });

  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/restaurants/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(response.data);
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          image: null, // Current image is shown, but upload handled separately
        });
      } catch (err) {
        console.error('Error fetching restaurant profile:', err);
        setError(
          err.response?.data?.message || 'Failed to fetch restaurant profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/restaurants/update/${restaurant._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Restaurant profile updated successfully!');
    } catch (err) {
      console.error('Error updating restaurant profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading restaurant profile...</p>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-4">Manage Restaurant Profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label className="block font-semibold mb-1">Restaurant Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Enter your restaurant's name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="border rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Enter a description for your restaurant"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Upload Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="mb-4"
            />
          </div>
          {restaurant?.image && (
            <div className="mb-4">
              <p>Current Image:</p>
              <img
                src={restaurant.image}
                alt="Current restaurant"
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
    </div>
  );
};

export default RestaurantProfile;
