// frontend/src/pages/RestaurantProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    image: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch restaurant details
      axios
        .get('http://localhost:5000/api/restaurants/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          setRestaurant(response.data);
          setFormData({
            description: response.data.description || '',
            image: null
          });
        })
        .catch((error) => {
          console.error('Error fetching restaurant profile:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    axios
      .put(`http://localhost:5000/api/restaurants/update/${restaurant._id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        alert('Restaurant profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      });
  };

  return (
    <div>
      <h2>Update Restaurant Profile</h2>
      {restaurant ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description of your restaurant"
              rows="4"
              cols="50"
            />
          </div>

          <div>
            <label>Upload Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
          </div>

          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>Loading restaurant profile...</p>
      )}
    </div>
  );
};

export default RestaurantProfile;
