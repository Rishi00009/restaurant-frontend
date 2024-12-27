import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', // Add name field for registration
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for empty fields
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const url = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    try {
      const response = await axios.post(url, formData);

      if (isLogin) {
        // Save token in localStorage on login
        localStorage.setItem('token', response.data.token);
        alert('Login successful');
        
        // Redirect to homepage after login
        navigate('/');
      } else {
        alert('Registration successful');
        setIsLogin(true); // After registration, switch to login mode
      }

      setErrorMessage(''); // Reset error message on success
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h1>

        {/* Show Name field only if it's Sign Up */}
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Display error message if there's one */}
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm">
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: '', email: '', password: '' }); // Reset form data
            }}
            className="text-blue-500 underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;

