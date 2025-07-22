import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import axios from 'axios';

export default function EntrepreneurProfileForm() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    bio: '',
    startupDescription: '',
    fundingNeed: '',
    pitchDeck: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
  const token = localStorage.getItem('token');
  await axios.post(
  'https://businessnexuswebsite.onrender.com/api/entrepreneur/profile',
  { ...form, userId: user._id },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

  setMessage('Profile created successfully!');
  setForm({ bio: '', startupDescription: '', fundingNeed: '', pitchDeck: '' });
} catch (err) {
  console.error('Axios error:', err);

  // Try to extract specific backend error message
  const errorMsg =
    err.response?.data?.msg || // backend error message
    err.response?.data?.error || // alternate backend format
    err.message || // axios/network error
    'Error submitting profile. Try again.';

  setMessage(errorMsg);
}

  };

  return (
    <DashboardLayout>
      <div className="container bg-white shadow-sm p-5 rounded">
        <h3 className="mb-4">Create Your Entrepreneur Profile</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              name="bio"
              rows="3"
              placeholder="Tell us about yourself"
              value={form.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Startup Description</label>
            <textarea
              className="form-control"
              name="startupDescription"
              rows="4"
              placeholder="What is your startup about?"
              value={form.startupDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Funding Need</label>
            <input
              type="text"
              className="form-control"
              name="fundingNeed"
              placeholder="E.g., $50,000"
              value={form.fundingNeed}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Pitch Deck (Link)</label>
            <input
              type="url"
              className="form-control"
              name="pitchDeck"
              placeholder="https://link-to-pitchdeck.com"
              value={form.pitchDeck}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary px-4">Submit Profile</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
