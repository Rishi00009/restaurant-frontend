import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ restaurantId }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews/create', { restaurantId, rating, comment }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming token is stored in localStorage
        }
      });
      setMessage('Review submitted successfully!');
      setRating(1);
      setComment('');
    } catch (error) {
      setMessage('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
      </div>
      <button type="submit">Submit Review</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ReviewForm;
