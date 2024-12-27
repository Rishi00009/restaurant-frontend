import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // Store the user's role (user or owner)
      } catch (error) {
        console.error('Error decoding token:', error);
      }

      axios
        .get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          setUser(response.data);
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            profilePicture: response.data.profilePicture || '',
            password: ''
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      console.log('No token found');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...formData };
    if (!formData.password) {
      delete updatedData.password; // Don't send empty password field
    }

    axios
      .put('http://localhost:5000/api/auth/profile', updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(() => {
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile!');
      });
  };

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
          />
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>Loading user profile...</p>
      )}
      <p>User Role: {role}</p>
    </div>
  );
};

export default UserProfile;
