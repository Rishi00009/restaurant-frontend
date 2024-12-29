import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    profilePicture: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          username: response.data.username,
          profilePicture: response.data.profilePicture || '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(
          err.response?.data?.message || 'Failed to fetch user profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleRestaurantProfileRedirect = () => {
    navigate('/restaurant/profile');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading user profile...</p>;
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
      <h2 className="text-3xl font-bold text-indigo-600 mb-4">User Profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {!isEditing ? (
          <>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
            )}
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 mt-4 transition duration-300"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="block font-semibold mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Profile Picture URL:</label>
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full mb-4"
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 mt-4 transition duration-300"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 mt-4 transition duration-300 ml-4"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {user.role === 'restaurantOwner' && (
        <button
          onClick={handleRestaurantProfileRedirect}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 mt-4 transition duration-300"
        >
          Manage Restaurant Profile
        </button>
      )}
    </div>
  );
};

export default UserProfile;
