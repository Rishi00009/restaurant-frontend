import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('https://restaurant-backend-yx5h.onrender.com/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://restaurant-backend-yx5h.onrender.com/api/restaurants/${editingId}`, form);
        alert('Restaurant updated');
      } else {
        await axios.post('https://restaurant-backend-yx5h.onrender.com/api/restaurants', form);
        alert('Restaurant created');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Failed to save restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setForm({ name: restaurant.name, description: restaurant.description });
    setEditingId(restaurant._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://restaurant-backend-yx5h.onrender.com/api/restaurants/${id}`);
      alert('Restaurant deleted');
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Failed to delete restaurant');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Manage Restaurants</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="border rounded-lg p-4 shadow-lg">
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <p className="text-gray-500 mb-4">{restaurant.description}</p>
            <button
              onClick={() => handleEdit(restaurant)}
              className="bg-yellow-500 text-white py-1 px-4 rounded mr-2 hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(restaurant._id)}
              className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRestaurantPage;
